export const CRIMINAL_STATUSES = [
  { value: "absconder", en: "Absconder", hi: "फरार", variant: "warning" as const },
  { value: "jail", en: "Jail", hi: "जेल", variant: "danger" as const },
  { value: "wanted", en: "Wanted", hi: "वांछित", variant: "danger" as const },
  { value: "on_bail", en: "On Bail", hi: "ज़मानत पर", variant: "default" as const },
] as const;

export type CriminalStatus = (typeof CRIMINAL_STATUSES)[number]["value"];

export const DEFAULT_CRIMINAL_STATUS: CriminalStatus = "wanted";

/** Map legacy status values stored before SP status update. */
const LEGACY_STATUS_MAP: Record<string, CriminalStatus> = {
  absconder: "absconder",
  absconding: "absconder",
  jail: "jail",
  arrested: "jail",
  wanted: "wanted",
  on_bail: "on_bail",
  "on bail": "on_bail",
  released: "on_bail",
  active: "wanted",
  deceased: "wanted",
  unknown: "wanted",
};

const VALID = new Set<string>(CRIMINAL_STATUSES.map((s) => s.value));

export function normalizeCriminalStatus(value?: string | null): CriminalStatus {
  const v = value?.trim().toLowerCase();
  if (!v) return DEFAULT_CRIMINAL_STATUS;
  if (VALID.has(v)) return v as CriminalStatus;
  if (LEGACY_STATUS_MAP[v]) return LEGACY_STATUS_MAP[v];
  return DEFAULT_CRIMINAL_STATUS;
}

export function criminalStatusLabel(value?: string | null): string {
  const normalized = normalizeCriminalStatus(value);
  const row = CRIMINAL_STATUSES.find((s) => s.value === normalized);
  return row ? `${row.en} / ${row.hi}` : normalized;
}

export function criminalStatusSelectOptions(allLabel = "All statuses / सभी स्थिति") {
  return [
    { value: "all", label: allLabel },
    ...CRIMINAL_STATUSES.map((s) => ({
      value: s.value,
      label: `${s.en} (${s.hi})`,
    })),
  ];
}

export function criminalStatusMeta(value?: string | null) {
  const normalized = normalizeCriminalStatus(value);
  return CRIMINAL_STATUSES.find((s) => s.value === normalized) ?? CRIMINAL_STATUSES[0];
}
