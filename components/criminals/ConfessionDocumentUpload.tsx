"use client";

import { useState } from "react";
import Link from "next/link";
import { FieldLabel } from "@/components/ui/FieldLabel";
import { EXTENDED_FIELDS } from "@/lib/criminal-extended-fields";

export function ConfessionDocumentUpload({
  pid,
  currentPath,
  onUploaded,
}: {
  pid: string;
  currentPath?: string;
  onUploaded: (path: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [documentPath, setDocumentPath] = useState(currentPath ?? "");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !pid) return;

    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("pid", pid);
    fd.append("documentType", "confession");

    const res = await fetch("/api/criminals/upload-document", {
      method: "POST",
      body: fd,
    });
    const data = await res.json();
    setUploading(false);

    if (res.ok && data.path) {
      setDocumentPath(data.path);
      onUploaded(data.path);
    } else {
      alert(data.error ?? "Upload failed");
    }
  }

  const fileName = documentPath ? documentPath.split("/").pop() : null;

  return (
    <article className="rounded-lg border border-[var(--color-border)] p-4">
      <FieldLabel
        en={EXTENDED_FIELDS.confession.en}
        hi={EXTENDED_FIELDS.confession.hi}
      />
      <p className="mt-1 text-xs text-[var(--color-muted)]">
        Upload PDF, Word, or image scan of the confession statement.
      </p>

      {documentPath ? (
        <section className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm">
          <p className="font-medium text-slate-800">{fileName}</p>
          <Link
            href={documentPath}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-primary)] hover:underline"
          >
            View / download document
          </Link>
        </section>
      ) : (
        <p className="mt-2 text-sm text-[var(--color-muted)]">No document uploaded yet.</p>
      )}

      <section className="mt-3 flex flex-wrap items-center gap-2">
        <input
          type="file"
          accept=".pdf,.doc,.docx,image/jpeg,image/png,image/webp"
          onChange={handleFile}
          disabled={!pid || uploading}
          className="text-xs"
        />
        {uploading ? (
          <span className="text-xs text-[var(--color-muted)]">Uploading...</span>
        ) : null}
      </section>
      {!pid ? (
        <p className="mt-1 text-xs text-amber-600">Enter PID first to upload document</p>
      ) : null}
    </article>
  );
}
