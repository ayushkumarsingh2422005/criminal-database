export const CRIMINAL_STATUSES = [
  { value: "active", en: "Active", hi: "सक्रिय", variant: "success" as const },
  { value: "absconding", en: "Absconding", hi: "फरार", variant: "warning" as const },
  { value: "arrested", en: "Arrested", hi: "गिरफ्तार", variant: "danger" as const },
  { value: "released", en: "Released", hi: "रिहा", variant: "default" as const },
  { value: "deceased", en: "Deceased", hi: "मृत", variant: "default" as const },
  { value: "unknown", en: "Unknown", hi: "अज्ञात", variant: "default" as const },
] as const;

export type CriminalStatus = (typeof CRIMINAL_STATUSES)[number]["value"];

export const DEFAULT_CRIMINAL_STATUS: CriminalStatus = "active";

const VALID = new Set<string>(CRIMINAL_STATUSES.map((s) => s.value));

export function normalizeCriminalStatus(value?: string | null): CriminalStatus {
  const v = value?.trim().toLowerCase();
  if (v && VALID.has(v)) return v as CriminalStatus;
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
