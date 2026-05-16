import { NextRequest } from "next/server";
import { requireAuth, jsonError, jsonOk } from "@/lib/api";
import { PoliceStationModel } from "@/models/PoliceStation";

export async function GET(request: NextRequest) {
  try {
    await requireAuth(request);
    const items = await PoliceStationModel.findAllActive();
    return jsonOk(
      items.map((s) => ({ id: s._id!.toString(), name: s.name, active: s.active }))
    );
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth(request);
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    if (!name) return jsonOk({ error: "Name is required" }, 400);

    const existing = await PoliceStationModel.findByNameInsensitive(name);
    if (existing) return jsonOk({ error: "Police station already exists" }, 409);

    const created = await PoliceStationModel.create({
      name,
      active: true,
      createdAt: new Date(),
    });

    return jsonOk(
      { id: created._id!.toString(), name: created.name, active: created.active },
      201
    );
  } catch (error) {
    return jsonError(error);
  }
}
