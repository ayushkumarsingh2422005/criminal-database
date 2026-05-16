"use client";

import Image from "next/image";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { FieldLabel, SectionTitle } from "@/components/ui/FieldLabel";
import { CRIMINAL_FIELDS, PHOTO_KEYS, photoLabel } from "@/lib/criminal-fields";
import { formatDateDisplay } from "@/lib/date-utils";
import type { CriminalRecord } from "@/lib/criminal-mapper";

export type { CriminalRecord };

function DetailField({
  en,
  hi,
  value,
}: {
  en: string;
  hi: string;
  value?: string | number | boolean | null;
}) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <article className="rounded-lg border border-[var(--color-border)] bg-slate-50 px-4 py-3">
      <FieldLabel en={en} hi={hi} />
      <p className="mt-1 text-sm font-medium text-slate-900 whitespace-pre-wrap">
        {typeof value === "boolean" ? (value ? "Yes / हाँ" : "No / नहीं") : value}
      </p>
    </article>
  );
}

function AddressBlock({
  titleEn,
  titleHi,
  addr,
}: {
  titleEn: string;
  titleHi: string;
  addr?: { line: string; thana?: string; district?: string };
}) {
  if (!addr?.line && !addr?.thana && !addr?.district) return null;
  const parts = [addr.line, addr.thana && `Thana: ${addr.thana}`, addr.district && `District: ${addr.district}`]
    .filter(Boolean)
    .join("\n");
  return <DetailField en={titleEn} hi={titleHi} value={parts} />;
}

export function CriminalDetailModal({
  criminal,
  open,
  onClose,
}: {
  criminal: CriminalRecord | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!criminal) return null;

  return (
    <Modal open={open} onClose={onClose} title="Criminal Record / आपराधिक विवरण" size="xl">
      <section className="space-y-8">
        <section>
          <SectionTitle
            en={CRIMINAL_FIELDS.crimeTypes.en}
            hi={CRIMINAL_FIELDS.crimeTypes.hi}
          />
          <section className="mt-3 flex flex-wrap gap-2">
            {criminal.crimeTypes.length === 0 ? (
              <span className="text-sm text-[var(--color-muted)]">—</span>
            ) : (
              criminal.crimeTypes.map((t) => (
                <Badge key={t} variant="default">
                  {t}
                </Badge>
              ))
            )}
          </section>
          <DetailField
            en={CRIMINAL_FIELDS.pid.en}
            hi={CRIMINAL_FIELDS.pid.hi}
            value={criminal.pid}
          />
        </section>

        <section>
          <SectionTitle en="Personal Details" hi="व्यक्तिगत विवरण" />
          <section className="mt-3 grid gap-3 sm:grid-cols-2">
            <DetailField
              en={CRIMINAL_FIELDS.name.en}
              hi={CRIMINAL_FIELDS.name.hi}
              value={criminal.name}
            />
            <DetailField
              en={CRIMINAL_FIELDS.nameAliases.en}
              hi={CRIMINAL_FIELDS.nameAliases.hi}
              value={criminal.nameAliases}
            />
            <DetailField
              en={CRIMINAL_FIELDS.dateOfBirth.en}
              hi={CRIMINAL_FIELDS.dateOfBirth.hi}
              value={formatDateDisplay(criminal.dateOfBirth)}
            />
            <DetailField
              en={CRIMINAL_FIELDS.aadhaarNumber.en}
              hi={CRIMINAL_FIELDS.aadhaarNumber.hi}
              value={
                criminal.aadhaarNumber
                  ? `${criminal.aadhaarNumber}${criminal.aadhaarVerified ? " (Verified / सत्यापित)" : ""}`
                  : undefined
              }
            />
            <DetailField
              en={CRIMINAL_FIELDS.fatherName.en}
              hi={CRIMINAL_FIELDS.fatherName.hi}
              value={criminal.fatherName}
            />
            <DetailField
              en={CRIMINAL_FIELDS.fatherNameAliases.en}
              hi={CRIMINAL_FIELDS.fatherNameAliases.hi}
              value={criminal.fatherNameAliases}
            />
            <DetailField
              en={CRIMINAL_FIELDS.mobileNumber.en}
              hi={CRIMINAL_FIELDS.mobileNumber.hi}
              value={criminal.mobileNumber}
            />
          </section>
          <section className="mt-3 grid gap-3 sm:grid-cols-2">
            <AddressBlock
              titleEn={CRIMINAL_FIELDS.permanentAddress.en}
              titleHi={CRIMINAL_FIELDS.permanentAddress.hi}
              addr={criminal.permanentAddress}
            />
            <AddressBlock
              titleEn={CRIMINAL_FIELDS.presentAddress.en}
              titleHi={CRIMINAL_FIELDS.presentAddress.hi}
              addr={criminal.presentAddress}
            />
          </section>
          <section className="mt-3 grid gap-3">
            <DetailField
              en={CRIMINAL_FIELDS.livelihoodMeans.en}
              hi={CRIMINAL_FIELDS.livelihoodMeans.hi}
              value={criminal.livelihoodMeans}
            />
            <DetailField
              en={CRIMINAL_FIELDS.livelihoodVerification.en}
              hi={CRIMINAL_FIELDS.livelihoodVerification.hi}
              value={criminal.livelihoodVerification}
            />
          </section>
        </section>

        <section>
          <SectionTitle
            en={CRIMINAL_FIELDS.photos.en}
            hi={CRIMINAL_FIELDS.photos.hi}
          />
          <section className="mt-3 grid gap-4 sm:grid-cols-2">
            {PHOTO_KEYS.map((key) => {
              const src = criminal.photos[key];
              if (!src) return null;
              return (
                <article
                  key={key}
                  className="overflow-hidden rounded-lg border border-[var(--color-border)]"
                >
                  <p className="bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700">
                    {photoLabel(key)}
                  </p>
                  <section className="relative aspect-[4/3] bg-slate-100">
                    <Image
                      src={src}
                      alt={photoLabel(key)}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </section>
                </article>
              );
            })}
          </section>
          {!PHOTO_KEYS.some((k) => criminal.photos[k]) && (
            <p className="text-sm text-[var(--color-muted)]">
              No photos uploaded. Store images in{" "}
              <code className="rounded bg-slate-100 px-1">/public/criminals/{criminal.pid}/</code>
            </p>
          )}
        </section>
      </section>
    </Modal>
  );
}
