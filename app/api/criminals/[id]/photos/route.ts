import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import { requireAuth, jsonError, jsonOk } from "@/lib/api";
import { CriminalModel, type CriminalPhotos } from "@/models/Criminal";
import { PHOTO_KEYS, type PhotoKey } from "@/lib/criminal-fields";
import { toCriminalRecord } from "@/lib/criminal-mapper";
import { enrichCriminalsFromDocs } from "@/lib/police-station-ref";
import { enrichCriminalRecord } from "@/lib/enrich-criminal-records";
import { assertCriminalAccess } from "@/lib/admin-scope";

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

    const body = (await request.json()) as { photos?: CriminalPhotos };
    const incoming = body.photos ?? {};
    const photos: CriminalPhotos = { ...(existing!.photos ?? {}) };

    for (const key of PHOTO_KEYS) {
      const value = incoming[key];
      if (value === null || value === "") {
        delete photos[key];
      } else if (typeof value === "string" && value.trim()) {
        photos[key] = value.trim();
      }
    }

    const result = await CriminalModel.update(id, {
      photos,
      updatedAt: new Date(),
    });
    if (!result) return jsonOk({ error: "Not found" }, 404);

    const [record] = await enrichCriminalsFromDocs([result], toCriminalRecord);
    return jsonOk(await enrichCriminalRecord(record));
  } catch (error) {
    return jsonError(error);
  }
}
