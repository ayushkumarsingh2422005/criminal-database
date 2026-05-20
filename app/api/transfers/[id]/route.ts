import { NextRequest } from "next/server";
import { requireAuth, jsonError, jsonOk } from "@/lib/api";
import { cancelTransfer } from "@/lib/criminal-transfer";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth(request);
    const { id } = await params;
    const item = await cancelTransfer(session, id);
    return jsonOk(item);
  } catch (error) {
    return jsonError(error);
  }
}
