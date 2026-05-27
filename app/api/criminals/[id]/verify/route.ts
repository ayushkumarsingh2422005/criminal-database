import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import { requireAuth, jsonError, jsonOk } from "@/lib/api";
import { CriminalModel, getCriminalCollection } from "@/models/Criminal";
import { toCriminalRecord } from "@/lib/criminal-mapper";
import { enrichCriminalsFromDocs } from "@/lib/police-station-ref";
import { enrichCriminalRecord } from "@/lib/enrich-criminal-records";
import { assertCriminalAccess } from "@/lib/admin-scope";
import { parseVerifiedAtFromClient } from "@/lib/verification";

export async function POST(
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

    const body = (await request.json().catch(() => ({}))) as {
      verifiedAt?: string;
      remark?: string;
    };

    const remark = body.remark ? String(body.remark).trim() : undefined;

    const record = {
      verifiedAt: parseVerifiedAtFromClient(body.verifiedAt),
      officerName: session.name,
      officerId: session.sub,
      ...(remark ? { remark } : {}),
    };

    const col = await getCriminalCollection();
    const result = await col.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $push: { verificationHistory: record },
        $set: { updatedAt: new Date() },
      },
      { returnDocument: "after" }
    );

    if (!result) {
      return jsonOk({ error: "Not found" }, 404);
    }

    const [base] = await enrichCriminalsFromDocs([result], toCriminalRecord);
    const enriched = await enrichCriminalRecord(base);
    return jsonOk(enriched);
  } catch (error) {
    return jsonError(error);
  }
}
