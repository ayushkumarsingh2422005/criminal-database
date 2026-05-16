import { NextRequest } from "next/server";
import { requireAuth, jsonError, jsonOk } from "@/lib/api";

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth(request);
    return jsonOk({
      id: session.sub,
      email: session.email,
      name: session.name,
      role: session.role,
    });
  } catch (error) {
    return jsonError(error);
  }
}
