"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { IconButton } from "@/components/ui/IconButton";
import { IconArrowLeft, IconPencil } from "@/components/ui/icons";
import { Badge } from "@/components/ui/Badge";
import { CRIMINAL_FIELDS, PHOTO_KEYS, photoLabel } from "@/lib/criminal-fields";
import { EXTENDED_FIELDS } from "@/lib/criminal-extended-fields";
import { formatDateDisplay } from "@/lib/date-utils";
import type { CriminalHistoryRecord, CriminalRecord } from "@/lib/criminal-mapper";
import type { BailerInfo, CriminalVehicle, RelatedPerson } from "@/models/Criminal";
import { DownloadPdfButton } from "./DownloadPdfButton";

const TABS = [
  { id: "overview", label: "Overview", hi: "अवलोकन" },
  { id: "profile", label: "Profile", hi: "व्यक्तिगत विवरण" },
  { id: "history", label: "Criminal History", hi: "आपराधिक इतिहास" },
  { id: "associates", label: "Associates", hi: "संबंधी व अन्य" },
  { id: "records", label: "Photos & Records", hi: "फोटो व दस्तावेज़" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function SummaryRow({
  labelEn,
  labelHi,
  value,
}: {
  labelEn: string;
  labelHi: string;
  value?: string | null;
}) {
  if (!value) return null;
  return (
    <section className="flex flex-col gap-0.5 border-b border-[var(--color-border)] py-3 last:border-0">
      <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
        {labelEn}{" "}
        <span className="font-normal normal-case">({labelHi})</span>
      </span>
      <span className="text-sm text-slate-900 whitespace-pre-wrap">{value}</span>
    </section>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <section className="flex-1 border-r border-[var(--color-border)] px-6 py-4 last:border-r-0">
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold text-slate-900">{value}</p>
    </section>
  );
}

function formatAddress(addr?: { line: string; thana?: string; district?: string }) {
  if (!addr) return "";
  return [addr.line, addr.thana && `Thana: ${addr.thana}`, addr.district && `District: ${addr.district}`]
    .filter(Boolean)
    .join("\n");
}

function hasPhysical(p: CriminalRecord["physicalDescription"]) {
  return Boolean(
    p.height ||
      p.complexion ||
      p.build ||
      p.identificationMarks ||
      p.deformity
  );
}

function HistoryTable({ rows }: { rows: CriminalHistoryRecord[] }) {
  if (rows.length === 0) {
    return <p className="text-sm text-[var(--color-muted)]">No criminal history on file.</p>;
  }
  return (
    <section className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)] bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
            <th className="px-3 py-2">{EXTENDED_FIELDS.sNo.en}</th>
            <th className="px-3 py-2">{EXTENDED_FIELDS.caseNumber.en}</th>
            <th className="px-3 py-2">{EXTENDED_FIELDS.firNumber.en}</th>
            <th className="px-3 py-2">{EXTENDED_FIELDS.firDate.en}</th>
            <th className="px-3 py-2">{EXTENDED_FIELDS.sectionAct.en}</th>
            <th className="px-3 py-2">PS</th>
            <th className="px-3 py-2">Judge</th>
            <th className="px-3 py-2">Court</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-[var(--color-border)] align-top">
              <td className="px-3 py-2">{row.sNo ?? i + 1}</td>
              <td className="px-3 py-2">{row.caseNumber || "—"}</td>
              <td className="px-3 py-2">{row.firNumber || "—"}</td>
              <td className="px-3 py-2">{formatDateDisplay(row.firDate) || "—"}</td>
              <td className="px-3 py-2">{row.sectionAct || "—"}</td>
              <td className="px-3 py-2">{row.policeStation || "—"}</td>
              <td className="px-3 py-2">{row.judgeName || "—"}</td>
              <td className="px-3 py-2">{row.court || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function PeopleTable({
  rows,
  showVehicle,
}: {
  rows: RelatedPerson[];
  showVehicle?: boolean;
}) {
  if (rows.length === 0) {
    return <p className="text-sm text-[var(--color-muted)]">No entries on file.</p>;
  }
  return (
    <section className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)] bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
            <th className="px-3 py-2">{EXTENDED_FIELDS.relation.en}</th>
            <th className="px-3 py-2">Name</th>
            <th className="px-3 py-2">Address</th>
            <th className="px-3 py-2">Mobile</th>
            <th className="px-3 py-2">Aadhaar</th>
            {showVehicle && <th className="px-3 py-2">Vehicle</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-[var(--color-border)] align-top">
              <td className="px-3 py-2">{row.relation || "—"}</td>
              <td className="px-3 py-2">{row.name || "—"}</td>
              <td className="px-3 py-2 whitespace-pre-wrap">{row.address || "—"}</td>
              <td className="px-3 py-2">{row.mobileNumber || "—"}</td>
              <td className="px-3 py-2">{row.aadhaarNumber || "—"}</td>
              {showVehicle && <td className="px-3 py-2">{row.vehicle || "—"}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function VehiclesTable({ rows }: { rows: CriminalVehicle[] }) {
  if (rows.length === 0) {
    return <p className="text-sm text-[var(--color-muted)]">No vehicles on file.</p>;
  }
  return (
    <section className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)] bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
            <th className="px-3 py-2">{EXTENDED_FIELDS.vehicleNumber.en}</th>
            <th className="px-3 py-2">{EXTENDED_FIELDS.vehicleOther.en}</th>
            <th className="px-3 py-2">{EXTENDED_FIELDS.vehicleRemarks.en}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-[var(--color-border)]">
              <td className="px-3 py-2">{row.vehicleNumber || "—"}</td>
              <td className="px-3 py-2">{row.otherDetails || "—"}</td>
              <td className="px-3 py-2">{row.remarks || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function BailersTable({ rows }: { rows: BailerInfo[] }) {
  if (rows.length === 0) {
    return <p className="text-sm text-[var(--color-muted)]">No bailer records on file.</p>;
  }
  return (
    <section className="space-y-4">
      {rows.map((row, i) => (
        <article
          key={i}
          className="rounded-lg border border-[var(--color-border)] p-4"
        >
          <section className="grid gap-0 sm:grid-cols-2 sm:gap-x-8">
            <SummaryRow labelEn="Name" labelHi="नाम" value={row.name} />
            <SummaryRow labelEn="Father's Name" labelHi="पिता" value={row.fatherName} />
            <SummaryRow labelEn="Mobile" labelHi="मो०नं०" value={row.mobileNumber} />
            <SummaryRow labelEn="Aadhaar" labelHi="आधार" value={row.aadhaarNumber} />
            <SummaryRow
              labelEn={EXTENDED_FIELDS.propertyDetails.en}
              labelHi={EXTENDED_FIELDS.propertyDetails.hi}
              value={row.propertyDetails}
            />
            <SummaryRow
              labelEn={EXTENDED_FIELDS.bailerFir.en}
              labelHi={EXTENDED_FIELDS.bailerFir.hi}
              value={row.firDetails}
            />
            <SummaryRow labelEn="Address" labelHi="पता" value={row.address} />
          </section>
        </article>
      ))}
    </section>
  );
}

export function CriminalDetailView({ criminal }: { criminal: CriminalRecord }) {
  const router = useRouter();
  const [tab, setTab] = useState<TabId>("overview");

  const ps =
    criminal.permanentAddress?.thana ?? criminal.presentAddress?.thana ?? "—";
  const district =
    criminal.permanentAddress?.district ??
    criminal.presentAddress?.district ??
    "—";
  const crimeSummary = criminal.crimeTypes.join(" • ") || "—";

  return (
    <section className="w-full space-y-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-[var(--color-muted)]">
        <Link href="/search" className="hover:text-[var(--color-primary)]">
          Search
        </Link>
        <span className="mx-2">/</span>
        <Link href="/criminals" className="hover:text-[var(--color-primary)]">
          Criminal Management
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-800">Criminal Detail</span>
      </nav>

      {/* Header */}
      <header className="flex flex-wrap items-start justify-between gap-4">
        <section>
          <h1 className="text-3xl font-bold text-slate-900">{criminal.name}</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            {ps} • PID {criminal.pid}
            {criminal.mobileNumber ? ` • ${criminal.mobileNumber}` : ""}
            {crimeSummary !== "—" ? ` • ${crimeSummary}` : ""}
          </p>
          <section className="mt-3 flex flex-wrap gap-2">
            {criminal.crimeTypes.map((t) => (
              <Badge key={t} variant="warning">
                {t}
              </Badge>
            ))}
            {criminal.aadhaarVerified && (
              <Badge variant="success">Aadhaar Verified / आधार सत्यापित</Badge>
            )}
            <Badge variant="default">PID {criminal.pid}</Badge>
          </section>
        </section>
        <section className="flex flex-wrap items-center gap-1">
          <IconButton label="Back" variant="outline" onClick={() => router.back()}>
            <IconArrowLeft />
          </IconButton>
          <DownloadPdfButton criminalId={criminal.id} pid={criminal.pid} />
          <IconButton
            label="Edit record"
            variant="primary"
            href={`/criminals?edit=${criminal.id}`}
          >
            <IconPencil />
          </IconButton>
        </section>
      </header>

      {/* Stats bar */}
      <section className="flex w-full flex-wrap overflow-hidden rounded-xl border border-[var(--color-border)] bg-white shadow-sm sm:flex-nowrap">
        <StatBox label="PID Number" value={criminal.pid} />
        <StatBox label="Police Station (PS)" value={ps} />
        <StatBox
          label="Criminal History"
          value={String(criminal.criminalHistory.length)}
        />
        <StatBox label="Crime Types" value={String(criminal.crimeTypes.length)} />
        <StatBox label="Mobile" value={criminal.mobileNumber ?? "—"} />
        <StatBox label="District" value={district} />
      </section>

      {/* Tabs */}
      <nav className="flex flex-wrap gap-1 border-b border-[var(--color-border)]">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition ${
              tab === t.id
                ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            {t.label}{" "}
            <span className="text-xs font-normal text-[var(--color-muted)]">
              ({t.hi})
            </span>
          </button>
        ))}
      </nav>

      {/* Tab content */}
      {tab === "overview" && (
        <section className="grid gap-6 lg:grid-cols-2">
          <Card title="Criminal Summary" subtitle="अपराधी सारांश">
            <SummaryRow
              labelEn={CRIMINAL_FIELDS.name.en}
              labelHi={CRIMINAL_FIELDS.name.hi}
              value={criminal.name}
            />
            <SummaryRow
              labelEn={CRIMINAL_FIELDS.pid.en}
              labelHi={CRIMINAL_FIELDS.pid.hi}
              value={criminal.pid}
            />
            <SummaryRow
              labelEn={CRIMINAL_FIELDS.crimeTypes.en}
              labelHi={CRIMINAL_FIELDS.crimeTypes.hi}
              value={criminal.crimeTypes.join(", ")}
            />
            <SummaryRow
              labelEn={CRIMINAL_FIELDS.fatherName.en}
              labelHi={CRIMINAL_FIELDS.fatherName.hi}
              value={criminal.fatherName}
            />
            <SummaryRow
              labelEn={CRIMINAL_FIELDS.mobileNumber.en}
              labelHi={CRIMINAL_FIELDS.mobileNumber.hi}
              value={criminal.mobileNumber}
            />
            <SummaryRow
              labelEn={CRIMINAL_FIELDS.dateOfBirth.en}
              labelHi={CRIMINAL_FIELDS.dateOfBirth.hi}
              value={formatDateDisplay(criminal.dateOfBirth)}
            />
          </Card>

          <Card title="Record Status" subtitle="रिकॉर्ड स्थिति">
            <SummaryRow
              labelEn="Aadhaar"
              labelHi="आधार"
              value={
                criminal.aadhaarNumber
                  ? `${criminal.aadhaarNumber}${criminal.aadhaarVerified ? " — Verified" : ""}`
                  : undefined
              }
            />
            <SummaryRow
              labelEn={CRIMINAL_FIELDS.livelihoodMeans.en}
              labelHi={CRIMINAL_FIELDS.livelihoodMeans.hi}
              value={criminal.livelihoodMeans}
            />
            <SummaryRow
              labelEn={CRIMINAL_FIELDS.livelihoodVerification.en}
              labelHi={CRIMINAL_FIELDS.livelihoodVerification.hi}
              value={criminal.livelihoodVerification}
            />
            <SummaryRow
              labelEn={EXTENDED_FIELDS.criminalHistory.en}
              labelHi={EXTENDED_FIELDS.criminalHistory.hi}
              value={String(criminal.criminalHistory.length)}
            />
            <SummaryRow
              labelEn="Photos on file"
              labelHi="फाइल में फोटो"
              value={`${PHOTO_KEYS.filter((k) => criminal.photos[k]).length} of ${PHOTO_KEYS.length}`}
            />
            {criminal.createdAt && (
              <SummaryRow
                labelEn="Record created"
                labelHi="रिकॉर्ड बनाया गया"
                value={new Date(criminal.createdAt).toLocaleString()}
              />
            )}
          </Card>
        </section>
      )}

      {tab === "profile" && (
        <section className="space-y-8">
          <Card title="Personal Details" subtitle="व्यक्तिगत विवरण">
            <section className="grid gap-0 sm:grid-cols-2 sm:gap-x-8">
              <SummaryRow
                labelEn={CRIMINAL_FIELDS.name.en}
                labelHi={CRIMINAL_FIELDS.name.hi}
                value={criminal.name}
              />
              <SummaryRow
                labelEn={CRIMINAL_FIELDS.nameAliases.en}
                labelHi={CRIMINAL_FIELDS.nameAliases.hi}
                value={criminal.nameAliases}
              />
              <SummaryRow
                labelEn={CRIMINAL_FIELDS.dateOfBirth.en}
                labelHi={CRIMINAL_FIELDS.dateOfBirth.hi}
                value={formatDateDisplay(criminal.dateOfBirth)}
              />
              <SummaryRow
                labelEn={CRIMINAL_FIELDS.aadhaarNumber.en}
                labelHi={CRIMINAL_FIELDS.aadhaarNumber.hi}
                value={criminal.aadhaarNumber}
              />
              <SummaryRow
                labelEn={CRIMINAL_FIELDS.fatherName.en}
                labelHi={CRIMINAL_FIELDS.fatherName.hi}
                value={criminal.fatherName}
              />
              <SummaryRow
                labelEn={CRIMINAL_FIELDS.fatherNameAliases.en}
                labelHi={CRIMINAL_FIELDS.fatherNameAliases.hi}
                value={criminal.fatherNameAliases}
              />
              <SummaryRow
                labelEn={CRIMINAL_FIELDS.mobileNumber.en}
                labelHi={CRIMINAL_FIELDS.mobileNumber.hi}
                value={criminal.mobileNumber}
              />
              <SummaryRow
                labelEn={CRIMINAL_FIELDS.livelihoodMeans.en}
                labelHi={CRIMINAL_FIELDS.livelihoodMeans.hi}
                value={criminal.livelihoodMeans}
              />
              <SummaryRow
                labelEn={CRIMINAL_FIELDS.livelihoodVerification.en}
                labelHi={CRIMINAL_FIELDS.livelihoodVerification.hi}
                value={criminal.livelihoodVerification}
              />
            </section>
          </Card>

          <section className="grid gap-6 lg:grid-cols-2">
            <Card
              title={CRIMINAL_FIELDS.permanentAddress.en}
              subtitle={CRIMINAL_FIELDS.permanentAddress.hi}
            >
              <p className="whitespace-pre-wrap text-sm text-slate-800">
                {formatAddress(criminal.permanentAddress) || "—"}
              </p>
            </Card>
            <Card
              title={CRIMINAL_FIELDS.presentAddress.en}
              subtitle={CRIMINAL_FIELDS.presentAddress.hi}
            >
              <p className="whitespace-pre-wrap text-sm text-slate-800">
                {formatAddress(criminal.presentAddress) || "—"}
              </p>
            </Card>
          </section>

          <Card title={EXTENDED_FIELDS.physical.en} subtitle={EXTENDED_FIELDS.physical.hi}>
            {hasPhysical(criminal.physicalDescription) ? (
              <section className="grid gap-0 sm:grid-cols-2 sm:gap-x-8">
                <SummaryRow
                  labelEn={EXTENDED_FIELDS.height.en}
                  labelHi={EXTENDED_FIELDS.height.hi}
                  value={criminal.physicalDescription.height}
                />
                <SummaryRow
                  labelEn={EXTENDED_FIELDS.complexion.en}
                  labelHi={EXTENDED_FIELDS.complexion.hi}
                  value={criminal.physicalDescription.complexion}
                />
                <SummaryRow
                  labelEn={EXTENDED_FIELDS.build.en}
                  labelHi={EXTENDED_FIELDS.build.hi}
                  value={criminal.physicalDescription.build}
                />
                <SummaryRow
                  labelEn={EXTENDED_FIELDS.identificationMarks.en}
                  labelHi={EXTENDED_FIELDS.identificationMarks.hi}
                  value={criminal.physicalDescription.identificationMarks}
                />
                <SummaryRow
                  labelEn={EXTENDED_FIELDS.deformity.en}
                  labelHi={EXTENDED_FIELDS.deformity.hi}
                  value={criminal.physicalDescription.deformity}
                />
              </section>
            ) : (
              <p className="text-sm text-[var(--color-muted)]">
                No physical description on file.
              </p>
            )}
          </Card>
        </section>
      )}

      {tab === "history" && (
        <Card
          title={EXTENDED_FIELDS.criminalHistory.en}
          subtitle={EXTENDED_FIELDS.criminalHistory.hi}
        >
          <HistoryTable rows={criminal.criminalHistory} />
        </Card>
      )}

      {tab === "associates" && (
        <section className="space-y-8">
          <Card title={EXTENDED_FIELDS.vehicles.en} subtitle={EXTENDED_FIELDS.vehicles.hi}>
            <VehiclesTable rows={criminal.vehicles} />
          </Card>
          <Card
            title={EXTENDED_FIELDS.closeRelatives.en}
            subtitle={EXTENDED_FIELDS.closeRelatives.hi}
          >
            <PeopleTable rows={criminal.closeRelatives} />
          </Card>
          <Card
            title={EXTENDED_FIELDS.gangMembers.en}
            subtitle={EXTENDED_FIELDS.gangMembers.hi}
          >
            <PeopleTable rows={criminal.gangMembers} showVehicle />
          </Card>
          <Card title={EXTENDED_FIELDS.bailers.en} subtitle={EXTENDED_FIELDS.bailers.hi}>
            <BailersTable rows={criminal.bailers} />
          </Card>
        </section>
      )}

      {tab === "records" && (
        <section className="space-y-8">
          <Card title={CRIMINAL_FIELDS.photos.en} subtitle={CRIMINAL_FIELDS.photos.hi}>
            <section className="grid gap-4 sm:grid-cols-2">
              {PHOTO_KEYS.map((key) => {
                const src = criminal.photos[key];
                return (
                  <article
                    key={key}
                    className="overflow-hidden rounded-lg border border-[var(--color-border)]"
                  >
                    <header className="bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700">
                      {photoLabel(key)}
                    </header>
                    {src ? (
                      <section className="relative aspect-[4/3] bg-slate-100">
                        <Image
                          src={src}
                          alt={photoLabel(key)}
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      </section>
                    ) : (
                      <p className="p-8 text-center text-sm text-[var(--color-muted)]">
                        No photo
                      </p>
                    )}
                  </article>
                );
              })}
            </section>
          </Card>

          <section className="grid gap-6 lg:grid-cols-2">
            <Card
              title={EXTENDED_FIELDS.confession.en}
              subtitle={EXTENDED_FIELDS.confession.hi}
            >
              <p className="whitespace-pre-wrap text-sm text-slate-800">
                {criminal.confessionStatement || "—"}
              </p>
            </Card>
            <Card title="Verification" subtitle="सत्यापन">
              <SummaryRow
                labelEn={EXTENDED_FIELDS.verificationDate.en}
                labelHi={EXTENDED_FIELDS.verificationDate.hi}
                value={formatDateDisplay(criminal.verification?.verificationDate)}
              />
              <SummaryRow
                labelEn={EXTENDED_FIELDS.verifyingOfficer.en}
                labelHi={EXTENDED_FIELDS.verifyingOfficer.hi}
                value={criminal.verification?.verifyingOfficer}
              />
            </Card>
          </section>
        </section>
      )}
    </section>
  );
}
