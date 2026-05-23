import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import { requireAuth, jsonError, jsonOk } from "@/lib/api";
import { CriminalModel } from "@/models/Criminal";
import { parseCriminalBody, toCriminalRecord } from "@/lib/criminal-mapper";
import { enrichCriminalsFromDocs } from "@/lib/police-station-ref";
import {
  assertCriminalAccess,
  applySessionWriteScope,
} from "@/lib/admin-scope";
import { applyVerificationWritePolicy } from "@/lib/verification-write";
import { enrichCriminalRecord } from "@/lib/enrich-criminal-records";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth(request);
    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return jsonOk({ error: "Invalid ID" }, 400);
    }

    const criminal = await CriminalModel.findById(id);
    await assertCriminalAccess(session, criminal);

    const [record] = await enrichCriminalsFromDocs([criminal!], toCriminalRecord);
    return jsonOk(await enrichCriminalRecord(record));
  } catch (error) {
    return jsonError(error);
  }
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

    const existing = await CriminalModel.findById(id);
    await assertCriminalAccess(session, existing);

    const body = await request.json();
    let parsed = await parseCriminalBody(body);
    parsed = await applySessionWriteScope(session, parsed);
    parsed = applyVerificationWritePolicy(session, existing, parsed, body);
    const update = { ...parsed, updatedAt: new Date() };

    const result = await CriminalModel.update(id, update);
    if (!result) {
      return jsonOk({ error: "Not found" }, 404);
    }

    const [record] = await enrichCriminalsFromDocs([result], toCriminalRecord);
    return jsonOk(await enrichCriminalRecord(record));
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

    const existing = await CriminalModel.findById(id);
    await assertCriminalAccess(session, existing);

    const result = await CriminalModel.delete(id);
    if (result.deletedCount === 0) {
      return jsonOk({ error: "Not found" }, 404);
    }

    return jsonOk({ success: true });
  } catch (error) {
    return jsonError(error);
  }
}
