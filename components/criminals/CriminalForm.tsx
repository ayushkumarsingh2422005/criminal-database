"use client";

import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { FieldLabel, SectionTitle } from "@/components/ui/FieldLabel";
import { CRIMINAL_FIELDS, PHOTO_KEYS, fieldLabel } from "@/lib/criminal-fields";
import { districtSelectOptions, normalizeDistrictValue } from "@/lib/jharkhand-districts";
import {
  DEFAULT_STATE,
  normalizeStateValue,
  stateSelectOptions,
} from "@/lib/indian-states";
import { toDateInputValue } from "@/lib/date-utils";
import { usePoliceStations } from "@/lib/hooks/use-lookups";
import { useAppSession } from "@/components/session/SessionProvider";
import type { CriminalRecord } from "@/lib/criminal-mapper";
import { PhotoUpload } from "./PhotoUpload";
import {
  CriminalExtendedForm,
  initialExtended,
} from "./CriminalExtendedForm";

export function CriminalForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: Partial<CriminalRecord>;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  onCancel: () => void;
}) {
  const session = useAppSession();
  const isSuperAdmin = session.role === "superadmin";
  const scopedPsId = session.policeStationId ?? "";
  const isScopedAdmin = session.role === "admin" && !!scopedPsId;
  const [verificationHistory, setVerificationHistory] = useState(
    initial?.verificationHistory ?? []
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pid, setPid] = useState(initial?.pid ?? "");
  const [photos, setPhotos] = useState(initial?.photos ?? {});
  const [aadhaarVerified, setAadhaarVerified] = useState(initial?.aadhaarVerified ?? false);
  const districtOptions = districtSelectOptions();
  const stateOptions = stateSelectOptions();
  const [permanent, setPermanent] = useState({
    line: initial?.permanentAddress?.line ?? "",
    policeStationId:
      initial?.permanentAddress?.policeStationId ?? (isScopedAdmin ? scopedPsId : ""),
    district: normalizeDistrictValue(initial?.permanentAddress?.district),
    state: normalizeStateValue(initial?.permanentAddress?.state) || DEFAULT_STATE,
  });
  const [present, setPresent] = useState({
    line: initial?.presentAddress?.line ?? "",
    policeStationId:
      initial?.presentAddress?.policeStationId ?? (isScopedAdmin ? scopedPsId : ""),
    district: normalizeDistrictValue(initial?.presentAddress?.district),
    state: normalizeStateValue(initial?.presentAddress?.state) || DEFAULT_STATE,
  });
  const [extended, setExtended] = useState(() => initialExtended(initial));
  const { items: policeStations, loading: psLoading } = usePoliceStations();

  const psOptions = [
    { value: "", label: "Select police station / पुलिस स्टेशन चुनें" },
    ...policeStations.map((s) => ({ value: s.id, label: s.name })),
  ];

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);

    try {
      await onSubmit({
        pid: fd.get("pid"),
        name: fd.get("name"),
        nameAliases: fd.get("nameAliases"),
        dateOfBirth: fd.get("dateOfBirth"),
        aadhaarNumber: fd.get("aadhaarNumber"),
        aadhaarVerified,
        fatherName: fd.get("fatherName"),
        fatherNameAliases: fd.get("fatherNameAliases"),
        mobileNumber: fd.get("mobileNumber"),
        permanentAddress: permanent,
        presentAddress: present,
        livelihoodMeans: fd.get("livelihoodMeans"),
        livelihoodVerification: fd.get("livelihoodVerification"),
        photos,
        ...extended,
        ...(isSuperAdmin ? { verificationHistory } : {}),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  const saveLabel = initial?.id ? "Update Criminal" : "Add Criminal";
  const saveLabelHi = initial?.id ? "अपडेट करें" : "जोड़ें";

  return (
    <form onSubmit={handleSubmit} className="relative -mb-6 pb-24">
      {error && (
        <p className="mb-6 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <section className="space-y-6 pr-1">

      <section className="space-y-3">
        <Input
          label={`${CRIMINAL_FIELDS.pid.en} (${CRIMINAL_FIELDS.pid.hi})`}
          name="pid"
          value={pid}
          onChange={(e) => setPid(e.target.value)}
          required
          placeholder="e.g., 269517"
        />
      </section>

      <section className="space-y-3">
        <SectionTitle en="Personal Details" hi="व्यक्तिगत विवरण" />
        <section className="grid gap-4 sm:grid-cols-2">
          <Input
            label={`${CRIMINAL_FIELDS.name.en} (${CRIMINAL_FIELDS.name.hi})`}
            name="name"
            defaultValue={initial?.name ?? ""}
            required
          />
          <Input
            label={`${CRIMINAL_FIELDS.nameAliases.en} (${CRIMINAL_FIELDS.nameAliases.hi})`}
            name="nameAliases"
            defaultValue={initial?.nameAliases ?? ""}
            placeholder="उर्फ / aliases"
          />
          <Input
            label={`${CRIMINAL_FIELDS.dateOfBirth.en} (${CRIMINAL_FIELDS.dateOfBirth.hi})`}
            name="dateOfBirth"
            type="date"
            defaultValue={toDateInputValue(initial?.dateOfBirth)}
          />
          <Input
            label={`${CRIMINAL_FIELDS.aadhaarNumber.en} (${CRIMINAL_FIELDS.aadhaarNumber.hi})`}
            name="aadhaarNumber"
            defaultValue={initial?.aadhaarNumber ?? ""}
          />
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input
              type="checkbox"
              checked={aadhaarVerified}
              onChange={(e) => setAadhaarVerified(e.target.checked)}
            />
            <FieldLabel
              en={CRIMINAL_FIELDS.aadhaarVerified.en}
              hi={CRIMINAL_FIELDS.aadhaarVerified.hi}
            />
          </label>
          <Input
            label={`${CRIMINAL_FIELDS.fatherName.en} (${CRIMINAL_FIELDS.fatherName.hi})`}
            name="fatherName"
            defaultValue={initial?.fatherName ?? ""}
          />
          <Input
            label={`${CRIMINAL_FIELDS.fatherNameAliases.en} (${CRIMINAL_FIELDS.fatherNameAliases.hi})`}
            name="fatherNameAliases"
            defaultValue={initial?.fatherNameAliases ?? ""}
          />
          <Input
            label={`${CRIMINAL_FIELDS.mobileNumber.en} (${CRIMINAL_FIELDS.mobileNumber.hi})`}
            name="mobileNumber"
            defaultValue={initial?.mobileNumber ?? ""}
          />
        </section>
      </section>

      <section className="space-y-3">
        <SectionTitle
          en={CRIMINAL_FIELDS.permanentAddress.en}
          hi={CRIMINAL_FIELDS.permanentAddress.hi}
        />
        <textarea
          name="permanentLine"
          rows={2}
          value={permanent.line}
          onChange={(e) =>
            setPermanent((p) => ({ ...p, line: e.target.value }))
          }
          className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm"
          placeholder="Full address"
        />
        <section className="grid gap-4 sm:grid-cols-2">
          {isScopedAdmin ? (
            <section className="flex flex-col gap-1 sm:col-span-2">
              <FieldLabel
                en={CRIMINAL_FIELDS.addressPoliceStation.en}
                hi={CRIMINAL_FIELDS.addressPoliceStation.hi}
              />
              <p className="rounded-lg border border-[var(--color-border)] bg-slate-50 px-3 py-2 text-sm font-medium text-slate-800">
                {session.policeStationName ?? "Your allotted PS"}
              </p>
            </section>
          ) : (
            <Select
              label={fieldLabel("addressPoliceStation")}
              name="permanentPoliceStationId"
              value={permanent.policeStationId}
              onChange={(e) =>
                setPermanent((p) => ({ ...p, policeStationId: e.target.value }))
              }
              options={psOptions}
            />
          )}
          <Select
            label={fieldLabel("district")}
            name="permanentDistrict"
            value={permanent.district}
            onChange={(e) =>
              setPermanent((p) => ({ ...p, district: e.target.value }))
            }
            options={districtOptions}
          />
          <Select
            label={fieldLabel("state")}
            name="permanentState"
            value={permanent.state}
            onChange={(e) =>
              setPermanent((p) => ({ ...p, state: e.target.value }))
            }
            options={stateOptions}
          />
        </section>
      </section>

      <section className="space-y-3">
        <section className="flex flex-wrap items-center justify-between gap-2">
          <SectionTitle
            en={CRIMINAL_FIELDS.presentAddress.en}
            hi={CRIMINAL_FIELDS.presentAddress.hi}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setPresent({
                ...permanent,
                policeStationId: isScopedAdmin
                  ? scopedPsId
                  : permanent.policeStationId,
              })
            }
          >
            Same as permanent address / स्थायी पते जैसा
          </Button>
        </section>
        <textarea
          name="presentLine"
          rows={2}
          value={present.line}
          onChange={(e) => setPresent((p) => ({ ...p, line: e.target.value }))}
          className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm"
        />
        <section className="grid gap-4 sm:grid-cols-2">
          {!isScopedAdmin && (
            <Select
              label={fieldLabel("addressPoliceStation")}
              name="presentPoliceStationId"
              value={present.policeStationId}
              onChange={(e) =>
                setPresent((p) => ({ ...p, policeStationId: e.target.value }))
              }
              options={psOptions}
            />
          )}
          <Select
            label={fieldLabel("district")}
            name="presentDistrict"
            value={present.district}
            onChange={(e) =>
              setPresent((p) => ({ ...p, district: e.target.value }))
            }
            options={districtOptions}
          />
          <Select
            label={fieldLabel("state")}
            name="presentState"
            value={present.state}
            onChange={(e) =>
              setPresent((p) => ({ ...p, state: e.target.value }))
            }
            options={stateOptions}
          />
        </section>
      </section>

      <section className="grid gap-4">
        <label className="flex flex-col gap-1">
          <FieldLabel
            en={CRIMINAL_FIELDS.livelihoodMeans.en}
            hi={CRIMINAL_FIELDS.livelihoodMeans.hi}
          />
          <textarea
            name="livelihoodMeans"
            rows={2}
            defaultValue={initial?.livelihoodMeans ?? ""}
            className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm"
          />
        </label>
        <label className="flex flex-col gap-1">
          <FieldLabel
            en={CRIMINAL_FIELDS.livelihoodVerification.en}
            hi={CRIMINAL_FIELDS.livelihoodVerification.hi}
          />
          <textarea
            name="livelihoodVerification"
            rows={2}
            defaultValue={initial?.livelihoodVerification ?? ""}
            className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm"
          />
        </label>
      </section>

      <section className="space-y-3">
        <SectionTitle en={CRIMINAL_FIELDS.photos.en} hi={CRIMINAL_FIELDS.photos.hi} />
        <p className="text-xs text-[var(--color-muted)]">
          Images are saved to <code className="rounded bg-slate-100 px-1">public/criminals/{"{PID}"}/</code>
        </p>
        <section className="grid gap-3 sm:grid-cols-2">
          {PHOTO_KEYS.map((key) => (
            <PhotoUpload
              key={key}
              pid={pid}
              photoKey={key}
              currentPath={photos[key]}
              onUploaded={(path) => setPhotos((p) => ({ ...p, [key]: path }))}
            />
          ))}
        </section>
      </section>

      <CriminalExtendedForm
        value={extended}
        onChange={setExtended}
        policeStationOptions={psOptions}
        isSuperAdmin={isSuperAdmin}
        verificationHistory={verificationHistory}
        onVerificationHistoryChange={setVerificationHistory}
      />
      </section>

      <footer className="sticky bottom-0 -mx-6 mt-6 border-t border-[var(--color-border)] bg-white/95 px-6 py-4 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur-sm">
        <section className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-[var(--color-muted)]">
            {saveLabel} / {saveLabelHi} — scroll any section, save stays here
          </p>
          <section className="flex gap-2">
            <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : saveLabel}
            </Button>
          </section>
        </section>
      </footer>
    </form>
  );
}
