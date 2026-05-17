import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import { requireAuth, jsonError } from "@/lib/api";
import { CriminalModel } from "@/models/Criminal";
import { toCriminalRecord } from "@/lib/criminal-mapper";
import { generateCriminalPdf } from "@/lib/pdf/generate-criminal-pdf";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(request);
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ error: "Invalid ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const criminal = await CriminalModel.findById(id);
    if (!criminal) {
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const record = toCriminalRecord(criminal);
    const pdf = await generateCriminalPdf(record);

    return new Response(new Uint8Array(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="criminal-${record.pid}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return jsonError(error);
  }
}
