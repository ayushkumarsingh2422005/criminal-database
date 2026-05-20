"use client";

import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { IconPlus, IconTrash } from "@/components/ui/icons";
import { SectionTitle } from "@/components/ui/FieldLabel";
import { extLabel } from "@/lib/criminal-extended-fields";
import {
  emptyBailer,
  emptyGangMember,
  emptyHistory,
  emptyRelative,
  emptyVehicle,
  emptyPhysical,
} from "@/lib/criminal-defaults";
import type { CriminalRecord } from "@/lib/criminal-mapper";
import { toDateInputValue } from "@/lib/date-utils";
import type { BailerInfo, RelatedPerson } from "@/models/Criminal";

function ListHeader({
  titleEn,
  titleHi,
  onAdd,
}: {
  titleEn: string;
  titleHi: string;
  onAdd: () => void;
}) {
  return (
    <section className="flex items-center justify-between gap-2">
      <SectionTitle en={titleEn} hi={titleHi} />
      <IconButton label="Add row" variant="outline" onClick={onAdd}>
        <IconPlus />
      </IconButton>
    </section>
  );
}

export function CriminalExtendedForm({
  value,
  onChange,
  policeStationOptions = [{ value: "", label: "Select police station" }],
}: {
  value: Pick<
    CriminalRecord,
    | "criminalHistory"
    | "vehicles"
    | "physicalDescription"
    | "closeRelatives"
    | "gangMembers"
    | "bailers"
    | "confessionStatement"
    | "verification"
  >;
  onChange: (v: typeof value) => void;
  policeStationOptions?: { value: string; label: string }[];
}) {
  const set = (patch: Partial<typeof value>) => onChange({ ...value, ...patch });

  return (
    <section className="space-y-8 border-t border-[var(--color-border)] pt-8">
      {/* Criminal History */}
      <section className="space-y-3">
        <ListHeader
          titleEn="Criminal History"
          titleHi="आपराधिक इतिहास"
          onAdd={() =>
            set({
              criminalHistory: [
                ...value.criminalHistory,
                { ...emptyHistory(), sNo: value.criminalHistory.length + 1 },
              ],
            })
          }
        />
        {value.criminalHistory.map((row, i) => (
          <article
            key={i}
            className="rounded-lg border border-[var(--color-border)] bg-slate-50 p-4"
          >
            <section className="mb-2 flex justify-between">
              <span className="text-xs font-medium text-slate-600">#{i + 1}</span>
              <IconButton
                label="Remove row"
                variant="ghost"
                onClick={() =>
                  set({
                    criminalHistory: value.criminalHistory.filter((_, j) => j !== i),
                  })
                }
              >
                <IconTrash />
              </IconButton>
            </section>
            <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Input
                label={extLabel("sNo")}
                type="number"
                value={row.sNo ?? ""}
                onChange={(e) => {
                  const next = [...value.criminalHistory];
                  next[i] = { ...row, sNo: Number(e.target.value) };
                  set({ criminalHistory: next });
                }}
              />
              <Input
                label={extLabel("caseNumber")}
                value={row.caseNumber ?? ""}
                onChange={(e) => {
                  const next = [...value.criminalHistory];
                  next[i] = { ...row, caseNumber: e.target.value };
                  set({ criminalHistory: next });
                }}
              />
              <Input
                label={extLabel("firNumber")}
                value={row.firNumber ?? ""}
                onChange={(e) => {
                  const next = [...value.criminalHistory];
                  next[i] = { ...row, firNumber: e.target.value };
                  set({ criminalHistory: next });
                }}
              />
              <Input
                label={extLabel("firDate")}
                type="date"
                value={toDateInputValue(row.firDate)}
                onChange={(e) => {
                  const next = [...value.criminalHistory];
                  next[i] = { ...row, firDate: e.target.value };
                  set({ criminalHistory: next });
                }}
              />
              <Input
                label={extLabel("sectionAct")}
                value={row.sectionAct ?? ""}
                onChange={(e) => {
                  const next = [...value.criminalHistory];
                  next[i] = { ...row, sectionAct: e.target.value };
                  set({ criminalHistory: next });
                }}
              />
              <Select
                label="Police Station (PS)"
                value={row.policeStationId ?? ""}
                onChange={(e) => {
                  const next = [...value.criminalHistory];
                  next[i] = { ...row, policeStationId: e.target.value };
                  set({ criminalHistory: next });
                }}
                options={policeStationOptions}
              />
              <Input
                label="Judge Name"
                value={row.judgeName ?? ""}
                onChange={(e) => {
                  const next = [...value.criminalHistory];
                  next[i] = { ...row, judgeName: e.target.value };
                  set({ criminalHistory: next });
                }}
              />
              <Input
                label="Court"
                value={row.court ?? ""}
                onChange={(e) => {
                  const next = [...value.criminalHistory];
                  next[i] = { ...row, court: e.target.value };
                  set({ criminalHistory: next });
                }}
              />
            </section>
          </article>
        ))}
      </section>

      {/* Vehicles */}
      <section className="space-y-3">
        <ListHeader
          titleEn="Vehicles"
          titleHi="वाहन विवरण"
          onAdd={() => set({ vehicles: [...value.vehicles, emptyVehicle()] })}
        />
        {value.vehicles.map((row, i) => (
          <article key={i} className="rounded-lg border border-[var(--color-border)] p-4">
            <section className="mb-2 flex justify-end">
              <IconButton
                label="Remove row"
                variant="ghost"
                onClick={() =>
                  set({ vehicles: value.vehicles.filter((_, j) => j !== i) })
                }
              >
                <IconTrash />
              </IconButton>
            </section>
            <section className="grid gap-3 sm:grid-cols-3">
              <Input
                label={extLabel("vehicleNumber")}
                value={row.vehicleNumber ?? ""}
                onChange={(e) => {
                  const next = [...value.vehicles];
                  next[i] = { ...row, vehicleNumber: e.target.value };
                  set({ vehicles: next });
                }}
              />
              <Input
                label={extLabel("vehicleOther")}
                value={row.otherDetails ?? ""}
                onChange={(e) => {
                  const next = [...value.vehicles];
                  next[i] = { ...row, otherDetails: e.target.value };
                  set({ vehicles: next });
                }}
              />
              <Input
                label={extLabel("vehicleRemarks")}
                value={row.remarks ?? ""}
                onChange={(e) => {
                  const next = [...value.vehicles];
                  next[i] = { ...row, remarks: e.target.value };
                  set({ vehicles: next });
                }}
              />
            </section>
          </article>
        ))}
      </section>

      {/* Physical */}
      <section className="space-y-3">
        <SectionTitle en="Physical Description" hi="शारीरिक विवरण" />
        <section className="grid gap-3 sm:grid-cols-2">
          {(
            [
              ["height", extLabel("height")],
              ["complexion", extLabel("complexion")],
              ["build", extLabel("build")],
            ] as const
          ).map(([key, label]) => (
            <Input
              key={key}
              label={label}
              value={value.physicalDescription[key] ?? ""}
              onChange={(e) =>
                set({
                  physicalDescription: {
                    ...value.physicalDescription,
                    [key]: e.target.value,
                  },
                })
              }
            />
          ))}
        </section>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">{extLabel("identificationMarks")}</span>
          <textarea
            rows={3}
            value={value.physicalDescription.identificationMarks ?? ""}
            onChange={(e) =>
              set({
                physicalDescription: {
                  ...value.physicalDescription,
                  identificationMarks: e.target.value,
                },
              })
            }
            className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm"
          />
        </label>
        <Input
          label={extLabel("deformity")}
          value={value.physicalDescription.deformity ?? ""}
          onChange={(e) =>
            set({
              physicalDescription: {
                ...value.physicalDescription,
                deformity: e.target.value,
              },
            })
          }
        />
      </section>

      {/* Close Relatives */}
      <RepeatablePeople
        titleEn="Close Relatives"
        titleHi="निकट संबंधी"
        rows={value.closeRelatives}
        onChange={(closeRelatives) => set({ closeRelatives })}
        factory={emptyRelative}
        showVehicle={false}
      />

      {/* Gang Members */}
      <RepeatablePeople
        titleEn="Gang / Group Members"
        titleHi="गुट के सदस्य"
        rows={value.gangMembers}
        onChange={(gangMembers) => set({ gangMembers })}
        factory={emptyGangMember}
        showVehicle
      />

      {/* Bailers */}
      <section className="space-y-3">
        <ListHeader
          titleEn="Bailers"
          titleHi="बेलर विवरण"
          onAdd={() => set({ bailers: [...value.bailers, emptyBailer()] })}
        />
        {value.bailers.map((row, i) => (
          <article key={i} className="rounded-lg border border-[var(--color-border)] p-4">
            <section className="mb-2 flex justify-end">
              <IconButton
                label="Remove row"
                variant="ghost"
                onClick={() => set({ bailers: value.bailers.filter((_, j) => j !== i) })}
              >
                <IconTrash />
              </IconButton>
            </section>
            <section className="grid gap-3 sm:grid-cols-2">
              <Input
                label="Name"
                value={row.name ?? ""}
                onChange={(e) => updateBailer(value, set, i, "name", e.target.value)}
              />
              <Input
                label="Father's Name"
                value={row.fatherName ?? ""}
                onChange={(e) =>
                  updateBailer(value, set, i, "fatherName", e.target.value)
                }
              />
              <Input
                label="Mobile"
                value={row.mobileNumber ?? ""}
                onChange={(e) =>
                  updateBailer(value, set, i, "mobileNumber", e.target.value)
                }
              />
              <Input
                label="Aadhaar"
                value={row.aadhaarNumber ?? ""}
                onChange={(e) =>
                  updateBailer(value, set, i, "aadhaarNumber", e.target.value)
                }
              />
              <label className="sm:col-span-2 flex flex-col gap-1">
                <span className="text-sm font-medium">{extLabel("propertyDetails")}</span>
                <textarea
                  rows={2}
                  value={row.propertyDetails ?? ""}
                  onChange={(e) =>
                    updateBailer(value, set, i, "propertyDetails", e.target.value)
                  }
                  className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm"
                />
              </label>
              <label className="sm:col-span-2 flex flex-col gap-1">
                <span className="text-sm font-medium">{extLabel("bailerFir")}</span>
                <textarea
                  rows={2}
                  value={row.firDetails ?? ""}
                  onChange={(e) =>
                    updateBailer(value, set, i, "firDetails", e.target.value)
                  }
                  className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm"
                />
              </label>
              <label className="sm:col-span-2 flex flex-col gap-1">
                <span className="text-sm font-medium">Address</span>
                <textarea
                  rows={2}
                  value={row.address ?? ""}
                  onChange={(e) => updateBailer(value, set, i, "address", e.target.value)}
                  className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm"
                />
              </label>
            </section>
          </article>
        ))}
      </section>

      {/* Confession & Verification */}
      <section className="space-y-3">
        <SectionTitle en="Confession Statement" hi="स्वीकारोक्ति बयान" />
        <textarea
          rows={4}
          value={value.confessionStatement ?? ""}
          onChange={(e) => set({ confessionStatement: e.target.value })}
          className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm"
        />
      </section>
      <section className="grid gap-3 sm:grid-cols-2">
        <Input
          label={extLabel("verificationDate")}
          type="date"
          value={value.verification?.verificationDate ?? ""}
          onChange={(e) =>
            set({
              verification: {
                ...value.verification,
                verificationDate: e.target.value,
              },
            })
          }
        />
        <Input
          label={extLabel("verifyingOfficer")}
          value={value.verification?.verifyingOfficer ?? ""}
          onChange={(e) =>
            set({
              verification: {
                ...value.verification,
                verifyingOfficer: e.target.value,
              },
            })
          }
        />
      </section>
    </section>
  );
}

function updateBailer(
  value: Parameters<typeof CriminalExtendedForm>[0]["value"],
  set: (v: typeof value) => void,
  i: number,
  field: keyof BailerInfo,
  val: string
) {
  const next = [...value.bailers];
  next[i] = { ...next[i], [field]: val };
  set({ ...value, bailers: next });
}

function RepeatablePeople({
  titleEn,
  titleHi,
  rows,
  onChange,
  factory,
  showVehicle,
}: {
  titleEn: string;
  titleHi: string;
  rows: RelatedPerson[];
  onChange: (rows: RelatedPerson[]) => void;
  factory: () => RelatedPerson;
  showVehicle: boolean;
}) {
  return (
    <section className="space-y-3">
      <ListHeader
        titleEn={titleEn}
        titleHi={titleHi}
        onAdd={() => onChange([...rows, factory()])}
      />
      {rows.map((row, i) => (
        <article key={i} className="rounded-lg border border-[var(--color-border)] p-4">
          <section className="mb-2 flex justify-end">
            <IconButton
              label="Remove row"
              variant="ghost"
              onClick={() => onChange(rows.filter((_, j) => j !== i))}
            >
              <IconTrash />
            </IconButton>
          </section>
          <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Input
              label={extLabel("relation")}
              value={row.relation ?? ""}
              onChange={(e) => {
                const next = [...rows];
                next[i] = { ...row, relation: e.target.value };
                onChange(next);
              }}
            />
            <Input
              label="Name"
              value={row.name ?? ""}
              onChange={(e) => {
                const next = [...rows];
                next[i] = { ...row, name: e.target.value };
                onChange(next);
              }}
            />
            <Input
              label="Mobile"
              value={row.mobileNumber ?? ""}
              onChange={(e) => {
                const next = [...rows];
                next[i] = { ...row, mobileNumber: e.target.value };
                onChange(next);
              }}
            />
            <Input
              label="Aadhaar"
              value={row.aadhaarNumber ?? ""}
              onChange={(e) => {
                const next = [...rows];
                next[i] = { ...row, aadhaarNumber: e.target.value };
                onChange(next);
              }}
            />
            {showVehicle && (
              <Input
                label="Vehicle / Two-wheeler"
                value={row.vehicle ?? ""}
                onChange={(e) => {
                  const next = [...rows];
                  next[i] = { ...row, vehicle: e.target.value };
                  onChange(next);
                }}
              />
            )}
            <label className="sm:col-span-2 lg:col-span-3 flex flex-col gap-1">
              <span className="text-sm font-medium">Address</span>
              <textarea
                rows={2}
                value={row.address ?? ""}
                onChange={(e) => {
                  const next = [...rows];
                  next[i] = { ...row, address: e.target.value };
                  onChange(next);
                }}
                className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm"
              />
            </label>
          </section>
        </article>
      ))}
    </section>
  );
}

export function initialExtended(
  initial?: Partial<CriminalRecord>
): Parameters<typeof CriminalExtendedForm>[0]["value"] {
  return {
    criminalHistory: initial?.criminalHistory ?? [],
    vehicles: initial?.vehicles ?? [],
    physicalDescription: initial?.physicalDescription ?? emptyPhysical(),
    closeRelatives: initial?.closeRelatives ?? [],
    gangMembers: initial?.gangMembers ?? [],
    bailers: initial?.bailers ?? [],
    confessionStatement: initial?.confessionStatement ?? "",
    verification: initial?.verification ?? {},
  };
}
