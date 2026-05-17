import fs from "fs";
import path from "path";
import { PHOTO_KEYS, type PhotoKey } from "@/lib/criminal-fields";
import type { CriminalPhotos } from "@/models/Criminal";

function mimeForExt(ext: string): string {
  switch (ext) {
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    default:
      return "image/jpeg";
  }
}

function fileToDataUri(full: string): string {
  const buf = fs.readFileSync(full);
  const mime = mimeForExt(path.extname(full).toLowerCase());
  return `data:${mime};base64,${buf.toString("base64")}`;
}

function findPhotoFile(stored: string | undefined, key: PhotoKey, pid?: string): string | null {
  if (stored) {
    const rel = stored.replace(/^\//, "").replace(/\\/g, "/");
    const fromStored = path.join(process.cwd(), "public", ...rel.split("/"));
    if (fs.existsSync(fromStored)) return fromStored;
  }

  if (!pid) return null;

  const dir = path.join(process.cwd(), "public", "criminals", pid);
  if (!fs.existsSync(dir)) return null;

  for (const ext of [".jpg", ".jpeg", ".png", ".webp"]) {
    const candidate = path.join(dir, `${key}${ext}`);
    if (fs.existsSync(candidate)) return candidate;
  }

  return null;
}

/** Resolve public photo paths to base64 data URIs for @react-pdf/renderer */
export function resolvePhotoSources(
  photos: CriminalPhotos,
  pid?: string
): Record<PhotoKey, string | null> {
  const out = {} as Record<PhotoKey, string | null>;

  for (const key of PHOTO_KEYS) {
    const file = findPhotoFile(photos[key], key, pid);
    out[key] = file ? fileToDataUri(file) : null;
  }

  return out;
}
