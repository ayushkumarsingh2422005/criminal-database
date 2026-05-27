import { NextRequest } from "next/server";
import { requireAuth, jsonError, jsonOk } from "@/lib/api";
import { Criminal, CriminalModel } from "@/models/Criminal";
import { parseCriminalBody, toCriminalRecord } from "@/lib/criminal-mapper";
import { buildCriminalFilter } from "@/lib/criminal-search";
import { enrichCriminalsFromDocs } from "@/lib/police-station-ref";
import { enrichCriminalRecords, enrichCriminalRecord } from "@/lib/enrich-criminal-records";
import {
  applySessionWriteScope,
  buildSessionCriminalScopeFilter,
} from "@/lib/admin-scope";
import { assertCanWriteCriminal } from "@/lib/auth";
import { applyVerificationWritePolicy } from "@/lib/verification-write";
import { DEFAULT_VERIFICATION_SEED_DATE } from "@/lib/verification";

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth(request);
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10))
    );
    const skip = (page - 1) * limit;
    const scopeFilter = await buildSessionCriminalScopeFilter(session);
    const filter = await buildCriminalFilter(searchParams, scopeFilter);

    const [items, total] = await Promise.all([
      CriminalModel.findMany(filter, { skip, limit }),
      CriminalModel.count(filter),
    ]);

    const records = await enrichCriminalsFromDocs(items, toCriminalRecord);
    const enriched = await enrichCriminalRecords(records);

    return jsonOk({
      items: enriched,
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
    assertCanWriteCriminal(session);
    const body = await request.json();
    let parsed = await parseCriminalBody(body);
    parsed = await applySessionWriteScope(session, parsed);
    parsed = applyVerificationWritePolicy(session, null, parsed, body);

    if (!parsed.pid || !parsed.name) {
      return jsonOk({ error: "PID and Name are required" }, 400);
    }

    const existing = await CriminalModel.findByPid(parsed.pid);
    if (existing) {
      return jsonOk({ error: "A criminal with this PID already exists" }, 409);
    }

    const criminal: Criminal = {
      ...parsed,
      verificationHistory: parsed.verificationHistory?.length
        ? parsed.verificationHistory
        : [
            {
              verifiedAt: DEFAULT_VERIFICATION_SEED_DATE,
              officerName: "System (initial seed)",
            },
          ],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: session.sub,
    };

    const inserted = await CriminalModel.create(criminal);
    const [record] = await enrichCriminalsFromDocs(
      [inserted!],
      toCriminalRecord
    );
    return jsonOk(await enrichCriminalRecord(record), 201);
  } catch (error) {
    return jsonError(error);
  }
}
