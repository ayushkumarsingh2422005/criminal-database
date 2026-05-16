import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import { requireAuth, jsonError, jsonOk } from "@/lib/api";
import { PoliceStation, PoliceStationModel } from "@/models/PoliceStation";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(request);
    const { id } = await params;
    if (!ObjectId.isValid(id)) return jsonOk({ error: "Invalid ID" }, 400);

    const body = await request.json();
    const update: Partial<PoliceStation> = {};
    if (body.name) update.name = String(body.name).trim();
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
    await requireAuth(request);
    const { id } = await params;
    if (!ObjectId.isValid(id)) return jsonOk({ error: "Invalid ID" }, 400);

    await PoliceStationModel.softDelete(id);
    return jsonOk({ success: true });
  } catch (error) {
    return jsonError(error);
  }
}
