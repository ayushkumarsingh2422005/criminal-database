/**
 * Edge-safe session helpers for middleware only.
 * Do not import bcrypt, mongodb, or other Node-only modules here.
 */
import { jwtVerify } from "jose";
import type { NextRequest } from "next/server";
import type { SessionPayload } from "./types";

export const COOKIE_NAME = "criminal_db_session";
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must be set and at least 32 characters");
  }
  return new TextEncoder().encode(secret);
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
