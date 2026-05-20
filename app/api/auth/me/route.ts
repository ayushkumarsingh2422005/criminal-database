import { NextRequest } from "next/server";
import { requireAuth, jsonError, jsonOk } from "@/lib/api";
import { buildAppSessionUser } from "@/lib/session-user";

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth(request);
    return jsonOk(await buildAppSessionUser(session));
  } catch (error) {
    return jsonError(error);
  }
}
