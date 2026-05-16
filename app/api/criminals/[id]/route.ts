import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import { requireAuth, jsonError, jsonOk } from "@/lib/api";
import { CriminalModel } from "@/models/Criminal";
import { parseCriminalBody, toCriminalRecord } from "@/lib/criminal-mapper";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(request);
    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return jsonOk({ error: "Invalid ID" }, 400);
    }

    const criminal = await CriminalModel.findById(id);
    if (!criminal) {
      return jsonOk({ error: "Not found" }, 404);
    }

    return jsonOk(toCriminalRecord(criminal));
  } catch (error) {
    return jsonError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(request);
    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return jsonOk({ error: "Invalid ID" }, 400);
    }

    const body = await request.json();
    const parsed = parseCriminalBody(body);
    const update = { ...parsed, updatedAt: new Date() };

    const result = await CriminalModel.update(id, update);
    if (!result) {
      return jsonOk({ error: "Not found" }, 404);
    }

    return jsonOk(toCriminalRecord(result));
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
    if (!ObjectId.isValid(id)) {
      return jsonOk({ error: "Invalid ID" }, 400);
    }

    const result = await CriminalModel.delete(id);
    if (result.deletedCount === 0) {
      return jsonOk({ error: "Not found" }, 404);
    }

    return jsonOk({ success: true });
  } catch (error) {
    return jsonError(error);
  }
}
