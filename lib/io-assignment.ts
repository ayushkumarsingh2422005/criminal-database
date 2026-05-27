import "server-only";

import { ObjectId } from "mongodb";
import { AdminModel } from "@/models/Admin";
import { AuthError } from "@/lib/auth";

export async function parseAssignedIoId(
  value: unknown,
  policeStationId?: ObjectId
): Promise<ObjectId | undefined> {
  if (value == null || value === "") return undefined;
  const id = String(value).trim();
  if (!ObjectId.isValid(id)) {
    throw new AuthError("Invalid investigation officer", 400);
  }

  const io = await AdminModel.findById(id);
  if (!io || io.role !== "io" || !io.active) {
    throw new AuthError("Invalid or inactive investigation officer", 400);
  }

  if (policeStationId && io.policeStationId?.toString() !== policeStationId.toString()) {
    throw new AuthError("Investigation officer does not belong to this police station", 400);
  }

  return new ObjectId(id);
}

export async function resolveIoPoliceStationId(
  permanentPsId?: string,
  presentPsId?: string
): Promise<ObjectId | undefined> {
  const id = permanentPsId?.trim() || presentPsId?.trim();
  if (!id || !ObjectId.isValid(id)) return undefined;
  return new ObjectId(id);
}
