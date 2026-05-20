import { NextRequest } from "next/server";
import { requireSuperAdmin } from "@/lib/auth";
import { requireAuth, jsonError, jsonOk } from "@/lib/api";
import { PoliceStationModel } from "@/models/PoliceStation";
import { getScopedPoliceStationId } from "@/lib/admin-scope";

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth(request);
    const scopePsId = await getScopedPoliceStationId(session);
    const forTransfer =
      new URL(request.url).searchParams.get("forTransfer") === "1" ||
      new URL(request.url).searchParams.get("forTransfer") === "true";

    const items = await PoliceStationModel.findAllActive();
    const mapStation = (s: (typeof items)[number]) => ({
      id: s._id!.toString(),
      name: s.name,
      active: s.active,
    });

    if (scopePsId && forTransfer) {
      return jsonOk(
        items
          .filter((s) => !s._id!.equals(scopePsId))
          .map(mapStation)
      );
    }

    if (scopePsId) {
      const station = items.find((s) => s._id!.equals(scopePsId));
      if (!station) return jsonOk([]);
      return jsonOk([mapStation(station)]);
    }

    return jsonOk(items.map(mapStation));
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth(request);
    requireSuperAdmin(session);

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
