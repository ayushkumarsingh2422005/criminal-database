"use client";

import { useState } from "react";
import { FieldLabel } from "@/components/ui/FieldLabel";
import type { PhotoKey } from "@/lib/criminal-fields";
import { photoLabel } from "@/lib/criminal-fields";

export function PhotoUpload({
  pid,
  photoKey,
  currentPath,
  onUploaded,
}: {
  pid: string;
  photoKey: PhotoKey;
  currentPath?: string;
  onUploaded: (path: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentPath ?? "");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !pid) return;

    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("pid", pid);
    fd.append("photoType", photoKey);

    const res = await fetch("/api/criminals/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);

    if (res.ok && data.path) {
      setPreview(data.path);
      onUploaded(data.path);
    } else {
      alert(data.error ?? "Upload failed");
    }
  }

  const labelParts = photoLabel(photoKey).match(/^(.+?) \((.+)\)$/);
  const en = labelParts?.[1] ?? photoKey;
  const hi = labelParts?.[2] ?? photoKey;

  return (
    <article className="rounded-lg border border-[var(--color-border)] p-3">
      <FieldLabel en={en} hi={hi} />
      {preview && (
        <img
          src={preview}
          alt={en}
          className="mt-2 h-28 w-full rounded object-cover bg-slate-100"
        />
      )}
      <section className="mt-2 flex flex-wrap items-center gap-2">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFile}
          disabled={!pid || uploading}
          className="text-xs"
        />
        {uploading && <span className="text-xs text-[var(--color-muted)]">Uploading...</span>}
      </section>
      {!pid && (
        <p className="mt-1 text-xs text-amber-600">Enter PID first to upload photos</p>
      )}
    </article>
  );
}
