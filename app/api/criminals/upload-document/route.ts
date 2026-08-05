import { NextRequest } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { requireAuth, jsonError, jsonOk } from "@/lib/api";
import { CriminalModel } from "@/models/Criminal";
import { assertCriminalWriteAccess } from "@/lib/admin-scope";
import { AuthError, isIo } from "@/lib/auth";

const ALLOWED_DOCUMENT_TYPES = ["confession"] as const;
type DocumentType = (typeof ALLOWED_DOCUMENT_TYPES)[number];

const ALLOWED_EXTENSIONS = ["pdf", "doc", "docx", "jpg", "jpeg", "png", "webp"];

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth(request);
    if (isIo(session)) {
      throw new AuthError("Investigation officers cannot upload confession documents", 403);
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const pid = String(formData.get("pid") ?? "").trim();
    const documentType = String(formData.get("documentType") ?? "") as DocumentType;

    if (!file || !pid || !ALLOWED_DOCUMENT_TYPES.includes(documentType)) {
      return jsonOk(
        { error: "File, PID, and valid document type are required" },
        400
      );
    }

    const existing = await CriminalModel.findByPid(pid);
    if (!existing) {
      return jsonOk({ error: "Criminal record not found for this PID" }, 404);
    }
    await assertCriminalWriteAccess(session, existing);

    const ext = file.name.split(".").pop()?.toLowerCase() || "pdf";
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return jsonOk(
        { error: "Allowed formats: PDF, DOC, DOCX, JPG, PNG, WEBP" },
        400
      );
    }

    const dir = path.join(process.cwd(), "public", "criminals", pid);
    await mkdir(dir, { recursive: true });

    const filename = `${documentType}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(dir, filename), buffer);

    const publicPath = `/criminals/${pid}/${filename}`;
    return jsonOk({ path: publicPath, documentType });
  } catch (error) {
    return jsonError(error);
  }
}
