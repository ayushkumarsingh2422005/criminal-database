import { NextRequest } from "next/server";
import { requireAuth, jsonError, jsonOk } from "@/lib/api";
import { CaseTypeModel } from "@/models/CaseType";

export async function GET(request: NextRequest) {
  try {
    await requireAuth(request);
    const items = await CaseTypeModel.findAllActive();
    return jsonOk(
      items.map((c) => ({ id: c._id!.toString(), name: c.name, active: c.active }))
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

    const existing = await CaseTypeModel.findByNameInsensitive(name);
    if (existing) return jsonOk({ error: "Case type already exists" }, 409);

    const created = await CaseTypeModel.create({
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
