import { NextRequest } from "next/server";
import { requireAuth, jsonError, jsonOk } from "@/lib/api";
import { Criminal, CriminalModel } from "@/models/Criminal";
import { parseCriminalBody, toCriminalRecord } from "@/lib/criminal-mapper";
import { buildCriminalFilter } from "@/lib/criminal-search";

export async function GET(request: NextRequest) {
  try {
    await requireAuth(request);
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10))
    );
    const skip = (page - 1) * limit;
    const filter = buildCriminalFilter(searchParams);

    const [items, total] = await Promise.all([
      CriminalModel.findMany(filter, { skip, limit }),
      CriminalModel.count(filter),
    ]);

    return jsonOk({
      items: items.map(toCriminalRecord),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth(request);
    const body = await request.json();
    const parsed = parseCriminalBody(body);

    if (!parsed.pid || !parsed.name) {
      return jsonOk({ error: "PID and Name are required" }, 400);
    }

    const existing = await CriminalModel.findByPid(parsed.pid);
    if (existing) {
      return jsonOk({ error: "A criminal with this PID already exists" }, 409);
    }

    const criminal: Criminal = {
      ...parsed,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: session.sub,
    };

    const inserted = await CriminalModel.create(criminal);
    return jsonOk(toCriminalRecord(inserted!), 201);
  } catch (error) {
    return jsonError(error);
  }
}
