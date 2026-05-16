import { NextResponse } from "next/server";
import { getSessionFromRequest, AuthError } from "./auth";
import type { NextRequest } from "next/server";
import type { SessionPayload } from "./types";

export async function requireAuth(
  request: NextRequest
): Promise<SessionPayload> {
  const session = await getSessionFromRequest(request);
  if (!session) {
    throw new AuthError("Unauthorized", 401);
  }
  return session;
}

export function jsonError(error: unknown) {
  if (error instanceof AuthError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status }
    );
  }
  console.error(error);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}
