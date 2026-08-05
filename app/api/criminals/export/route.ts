import { NextRequest, NextResponse } from "next/server";
import { requireAuth, jsonError } from "@/lib/api";
import { AuthError } from "@/lib/auth";
import { CriminalModel } from "@/models/Criminal";
import { toCriminalRecord } from "@/lib/criminal-mapper";
import { buildCriminalFilter } from "@/lib/criminal-search";
import { enrichCriminalsFromDocs } from "@/lib/police-station-ref";
import { enrichCriminalRecords } from "@/lib/enrich-criminal-records";
import { buildSessionCriminalScopeFilter } from "@/lib/admin-scope";
import {
  criminalsToCsv,
  CSV_EXPORT_MAX_ROWS,
  parseExportGroups,
} from "@/lib/criminal-csv-export";

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth(request);
    const { searchParams } = new URL(request.url);
    const scopeFilter = await buildSessionCriminalScopeFilter(session);
    const filter = await buildCriminalFilter(searchParams, scopeFilter);
    const groups = parseExportGroups(searchParams.get("columns"), session.role);

    const total = await CriminalModel.count(filter);
    if (total === 0) {
      return jsonError(new Error("No records match the selected filters"));
    }
    if (total > CSV_EXPORT_MAX_ROWS) {
      return jsonError(
        new Error(
          `Too many records (${total}). Narrow your filters — maximum ${CSV_EXPORT_MAX_ROWS.toLocaleString()} rows per export.`
        )
      );
    }

    const items = await CriminalModel.findMany(filter, {
      skip: 0,
      limit: CSV_EXPORT_MAX_ROWS,
    });
    const records = await enrichCriminalsFromDocs(items, toCriminalRecord);
    const enriched = await enrichCriminalRecords(records);
    const csv = criminalsToCsv(enriched, groups);

    const stamp = new Date().toISOString().slice(0, 10);
    const filename = `criminals-export-${stamp}.csv`;

    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "X-Export-Total": String(total),
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return jsonError(error);
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return jsonError(error);
  }
}
