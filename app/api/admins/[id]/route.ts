import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import { hashPassword, requireSuperAdmin } from "@/lib/auth";
import { requireAuth, jsonError, jsonOk } from "@/lib/api";
import { Admin, AdminModel } from "@/models/Admin";
import { PoliceStationModel } from "@/models/PoliceStation";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth(request);
    requireSuperAdmin(session);

    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return jsonOk({ error: "Invalid admin ID" }, 400);
    }

    const body = await request.json();
    const update: Partial<Admin> = { updatedAt: new Date() };

    if (body.name !== undefined) update.name = String(body.name).trim();
    if (body.role === "superadmin" || body.role === "admin") {
      update.role = body.role;
      if (body.role === "superadmin") {
        update.policeStationId = undefined;
      }
    }
    if (body.policeStationId !== undefined) {
      const psId = String(body.policeStationId).trim();
      if (!psId) {
        update.policeStationId = undefined;
      } else if (ObjectId.isValid(psId)) {
        const station = await PoliceStationModel.findById(psId);
        if (!station) {
          return jsonOk({ error: "Police station not found" }, 400);
        }
        update.policeStationId = new ObjectId(psId);
      }
    }
    if (typeof body.active === "boolean") update.active = body.active;
    if (body.password && String(body.password).length >= 8) {
      update.passwordHash = await hashPassword(String(body.password));
    }

    const result = await AdminModel.update(id, update);
    if (!result) {
      return jsonOk({ error: "Admin not found" }, 404);
    }

    const station = result.policeStationId
      ? await PoliceStationModel.findById(result.policeStationId.toString())
      : null;

    return jsonOk({
      id: result._id!.toString(),
      email: result.email,
      name: result.name,
      role: result.role,
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
    requireSuperAdmin(session);

    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return jsonOk({ error: "Invalid admin ID" }, 400);
    }

    if (session.sub === id) {
      return jsonOk({ error: "Cannot delete your own account" }, 400);
    }

    const result = await AdminModel.delete(id);
    if (result.deletedCount === 0) {
      return jsonOk({ error: "Admin not found" }, 404);
    }

    return jsonOk({ success: true });
  } catch (error) {
    return jsonError(error);
  }
}
