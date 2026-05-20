import { NextRequest } from "next/server";
import { requireAuth, jsonError, jsonOk } from "@/lib/api";
import { acceptTransfer } from "@/lib/criminal-transfer";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth(request);
    const { id } = await params;
    const item = await acceptTransfer(session, id);
    return jsonOk(item);
  } catch (error) {
    return jsonError(error);
  }
}
