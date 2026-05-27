"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { CRIMINAL_FIELDS, PHOTO_KEYS } from "@/lib/criminal-fields";
import { PhotoUpload } from "@/components/criminals/PhotoUpload";
import type { CriminalRecord } from "@/lib/criminal-mapper";
import type { CriminalPhotos } from "@/models/Criminal";

export function IoPhotoPanel({
  criminal,
  onUpdated,
}: {
  criminal: CriminalRecord;
  onUpdated: (record: CriminalRecord) => void;
}) {
  const [photos, setPhotos] = useState<CriminalPhotos>(criminal.photos ?? {});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function savePhotos(next: CriminalPhotos) {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/criminals/${criminal.id}/photos`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photos: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to save photos");
      setPhotos(data.photos ?? next);
      onUpdated(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save photos");
    } finally {
      setSaving(false);
    }
  }

  async function handleUploaded(key: keyof CriminalPhotos, path: string) {
    const next = { ...photos, [key]: path };
    setPhotos(next);
    await savePhotos(next);
  }

  return (
    <Card title={CRIMINAL_FIELDS.photos.en} subtitle={CRIMINAL_FIELDS.photos.hi}>
      {error ? (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      ) : null}
      {saving ? (
        <p className="mb-4 text-sm text-[var(--color-muted)]">Saving photos...</p>
      ) : null}
      <section className="grid gap-4 sm:grid-cols-2">
        {PHOTO_KEYS.map((key) => (
          <PhotoUpload
            key={key}
            pid={criminal.pid}
            photoKey={key}
            currentPath={photos[key]}
            onUploaded={(path) => handleUploaded(key, path)}
          />
        ))}
      </section>
    </Card>
  );
}
