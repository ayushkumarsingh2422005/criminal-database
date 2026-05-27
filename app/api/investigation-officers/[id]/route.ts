import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import {
  canManageInvestigationOfficers,
  hashPassword,
  AuthError,
} from "@/lib/auth";
import { requireAuth, jsonError, jsonOk } from "@/lib/api";
import { AdminModel } from "@/models/Admin";
import { PoliceStationModel } from "@/models/PoliceStation";
import { getScopedPoliceStationId } from "@/lib/admin-scope";

async function assertCanManageIo(ioId: string, session: Awaited<ReturnType<typeof requireAuth>>) {
  if (!canManageInvestigationOfficers(session)) {
    throw new AuthError("Access denied", 403);
  }
  const io = await AdminModel.findById(ioId);
  if (!io || io.role !== "io") {
    throw new AuthError("Investigation officer not found", 404);
  }
  const scopedPs = await getScopedPoliceStationId(session);
  if (scopedPs && io.policeStationId?.toString() !== scopedPs.toString()) {
    throw new AuthError("Access denied", 403);
  }
  return io;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth(request);
    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return jsonOk({ error: "Invalid ID" }, 400);
    }

    const io = await assertCanManageIo(id, session);
    const body = await request.json();
    const update: Record<string, unknown> = { updatedAt: new Date() };

    if (body.name != null) update.name = String(body.name).trim();
    if (body.active != null) update.active = Boolean(body.active);

    if (body.password && String(body.password).length >= 8) {
      update.passwordHash = await hashPassword(String(body.password));
    }

    if (body.policeStationId != null && session.role === "superadmin") {
      const psId = String(body.policeStationId).trim();
      if (!ObjectId.isValid(psId)) {
        return jsonOk({ error: "Invalid police station" }, 400);
      }
      const station = await PoliceStationModel.findById(psId);
      if (!station?.active) {
        return jsonOk({ error: "Invalid or inactive police station" }, 400);
      }
      update.policeStationId = new ObjectId(psId);
    }

    const result = await AdminModel.update(id, update);
    if (!result) return jsonOk({ error: "Not found" }, 404);

    const station = result.policeStationId
      ? await PoliceStationModel.findById(result.policeStationId.toString())
      : null;

    return jsonOk({
      id: result._id!.toString(),
      email: result.email,
      name: result.name,
      role: "io",
      active: result.active,
      policeStationId: result.policeStationId?.toString(),
      policeStationName: station?.name,
    });
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth(request);
    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return jsonOk({ error: "Invalid ID" }, 400);
    }

    await assertCanManageIo(id, session);
    if (id === session.sub) {
      return jsonOk({ error: "Cannot delete your own account" }, 400);
    }

    const result = await AdminModel.delete(id);
    if (result.deletedCount === 0) {
      return jsonOk({ error: "Not found" }, 404);
    }

    return jsonOk({ success: true });
  } catch (error) {
    return jsonError(error);
  }
}
