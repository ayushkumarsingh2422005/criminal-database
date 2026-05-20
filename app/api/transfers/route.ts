import { NextRequest } from "next/server";
import { requireAuth, jsonError, jsonOk } from "@/lib/api";
import {
  createTransferRequest,
  listTransfersForSession,
} from "@/lib/criminal-transfer";

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth(request);
    const data = await listTransfersForSession(session);
    return jsonOk(data);
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth(request);
    const body = await request.json();
    const criminalId = String(body.criminalId ?? "").trim();
    const toPoliceStationId = String(body.toPoliceStationId ?? "").trim();
    const message = body.message ? String(body.message) : undefined;

    if (!criminalId || !toPoliceStationId) {
      return jsonOk(
        { error: "Criminal and target police station are required" },
        400
      );
    }

    const item = await createTransferRequest(
      session,
      criminalId,
      toPoliceStationId,
      message
    );
    return jsonOk(item, 201);
  } catch (error) {
    return jsonError(error);
  }
}
