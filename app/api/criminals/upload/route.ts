import { NextRequest } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { requireAuth, jsonError, jsonOk } from "@/lib/api";
import { PHOTO_KEYS, type PhotoKey } from "@/lib/criminal-fields";

export async function POST(request: NextRequest) {
  try {
    await requireAuth(request);
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const pid = String(formData.get("pid") ?? "").trim();
    const photoType = String(formData.get("photoType") ?? "") as PhotoKey;

    if (!file || !pid || !PHOTO_KEYS.includes(photoType)) {
      return jsonOk({ error: "File, PID, and valid photo type are required" }, 400);
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const allowed = ["jpg", "jpeg", "png", "webp"];
    if (!allowed.includes(ext)) {
      return jsonOk({ error: "Only JPG, PNG, WEBP images allowed" }, 400);
    }

    const dir = path.join(process.cwd(), "public", "criminals", pid);
    await mkdir(dir, { recursive: true });

    const filename = `${photoType}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(dir, filename), buffer);

    const publicPath = `/criminals/${pid}/${filename}`;
    return jsonOk({ path: publicPath, photoType });
  } catch (error) {
    return jsonError(error);
  }
}
