import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { AdminModel } from "@/models/Admin";
import type { SessionPayload } from "./types";

const COOKIE_NAME = "criminal_db_session";
const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must be set and at least 32 characters");
  }
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(
  payload: SessionPayload
): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecret());
}

export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (
      typeof payload.sub !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.name !== "string" ||
      (payload.role !== "superadmin" &&
        payload.role !== "admin" &&
        payload.role !== "io")
    ) {
      return null;
    }

    const policeStationId =
      typeof payload.policeStationId === "string" &&
      payload.policeStationId.length > 0
        ? payload.policeStationId
        : undefined;

    return {
      sub: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role,
      ...(policeStationId ? { policeStationId } : {}),
    };
  } catch {
    return null;
  }
}

export function sessionCookieOptions(maxAge = SESSION_MAX_AGE) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

export { COOKIE_NAME, SESSION_MAX_AGE };

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, sessionCookieOptions());
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSessionFromCookies(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export function getTokenFromRequest(request: NextRequest): string | undefined {
  const cookieToken = request.cookies.get(COOKIE_NAME)?.value;
  if (cookieToken) return cookieToken;

  const authorization = request.headers.get("authorization");
  if (authorization?.startsWith("Bearer ")) {
    const bearerToken = authorization.slice(7).trim();
    return bearerToken || undefined;
  }

  return undefined;
}

export async function getSessionFromRequest(
  request: NextRequest
): Promise<SessionPayload | null> {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  return verifySessionToken(token);
}

export function requireSuperAdmin(session: SessionPayload | null) {
  if (!session || session.role !== "superadmin") {
    throw new AuthError("Superadmin access required", 403);
  }
}

export function isIo(session: SessionPayload): boolean {
  return session.role === "io";
}

export function isPsAdmin(session: SessionPayload): boolean {
  return session.role === "admin" && !!session.policeStationId;
}

export function canManageInvestigationOfficers(session: SessionPayload): boolean {
  return session.role === "superadmin" || isPsAdmin(session);
}

export function assertCanWriteCriminal(session: SessionPayload) {
  if (isIo(session)) {
    throw new AuthError("Investigation officers have read-only access to criminal records", 403);
  }
}

/** Re-check account is active and matches JWT claims (revokes stale tokens). */
export async function validateSessionAccount(
  session: SessionPayload
): Promise<SessionPayload> {
  const admin = await AdminModel.findById(session.sub);
  if (!admin || !admin.active) {
    throw new AuthError("Account inactive or not found. Please sign in again.", 401);
  }
  if (admin.role !== session.role) {
    throw new AuthError("Session expired. Please sign in again.", 401);
  }
  if (admin.email.toLowerCase() !== session.email.toLowerCase()) {
    throw new AuthError("Session expired. Please sign in again.", 401);
  }

  const dbPsId = admin.policeStationId?.toString();
  if (admin.role === "admin" || admin.role === "io") {
    if (!dbPsId) {
      throw new AuthError("Account is not assigned to a police station", 403);
    }
    if (session.policeStationId && session.policeStationId !== dbPsId) {
      throw new AuthError("Session expired. Please sign in again.", 401);
    }
  }

  return {
    sub: admin._id!.toString(),
    email: admin.email,
    name: admin.name,
    role: admin.role,
    ...(dbPsId ? { policeStationId: dbPsId } : {}),
  };
}

export class AuthError extends Error {
  status: number;
  constructor(message: string, status = 401) {
    super(message);
    this.status = status;
  }
}
