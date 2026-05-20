import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import { requireAuth, jsonError, jsonOk } from "@/lib/api";
import { requireSuperAdmin } from "@/lib/auth";
import { PoliceStation, PoliceStationModel } from "@/models/PoliceStation";
import { countPoliceStationReferences } from "@/lib/police-station-ref";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth(request);
    requireSuperAdmin(session);
    const { id } = await params;
    if (!ObjectId.isValid(id)) return jsonOk({ error: "Invalid ID" }, 400);

    const body = await request.json();
    const update: Partial<PoliceStation> = {};
    if (body.name) {
      const name = String(body.name).trim();
      const duplicate = await PoliceStationModel.findByNameInsensitive(name);
      if (duplicate && duplicate._id!.toString() !== id) {
        return jsonOk({ error: "Police station already exists" }, 409);
      }
      update.name = name;
    }
    if (typeof body.active === "boolean") update.active = body.active;

    const result = await PoliceStationModel.update(id, update);
    if (!result) return jsonOk({ error: "Not found" }, 404);
    return jsonOk({ id: result._id!.toString(), name: result.name, active: result.active });
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
    if (!ObjectId.isValid(id)) return jsonOk({ error: "Invalid ID" }, 400);

    const refs = await countPoliceStationReferences(id);
    if (refs > 0) {
      return jsonOk(
        {
          error: `Cannot remove: this police station is linked to ${refs} criminal record(s).`,
        },
        409
      );
    }

    await PoliceStationModel.softDelete(id);
    return jsonOk({ success: true });
  } catch (error) {
    return jsonError(error);
  }
}
