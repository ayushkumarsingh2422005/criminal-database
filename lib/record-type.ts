export const RECORD_TYPES = [
  {
    value: "criminal",
    en: "Criminal + Dagi",
    hi: "अपराधी + दागी",
    shortEn: "Criminal",
    shortHi: "अपराधी",
    hint: "Charge-sheeted person — counted as both Criminal and Dagi (uses PID)",
  },
  {
    value: "dagi",
    en: "Dagi only",
    hi: "केवल दागी",
    shortEn: "Dagi",
    shortHi: "दागी",
    hint: "Declared as Dagi only — not a charge-sheeted criminal (uses Dagi number)",
  },
] as const;

export type RecordType = (typeof RECORD_TYPES)[number]["value"];

export const DEFAULT_RECORD_TYPE: RecordType = "criminal";

const VALID = new Set<string>(RECORD_TYPES.map((t) => t.value));

export function normalizeRecordType(value?: string | null): RecordType {
  const v = value?.trim().toLowerCase();
  if (v && VALID.has(v)) return v as RecordType;
  return DEFAULT_RECORD_TYPE;
}

export function recordTypeLabel(value?: string | null): string {
  const normalized = normalizeRecordType(value);
  const row = RECORD_TYPES.find((t) => t.value === normalized);
  return row ? `${row.en} / ${row.hi}` : normalized;
}

export function recordTypeShortLabel(value?: string | null): string {
  const normalized = normalizeRecordType(value);
  const row = RECORD_TYPES.find((t) => t.value === normalized);
  return row ? row.shortEn : normalized;
}

/** True when declared as Dagi-only (not a charge-sheeted criminal). */
export function isDagiOnly(value?: string | null): boolean {
  return normalizeRecordType(value) === "dagi";
}

/** True when declared as Criminal (also counts as Dagi). */
export function isCriminalRecord(value?: string | null): boolean {
  return normalizeRecordType(value) === "criminal";
}

export function recordTypeSelectOptions(allLabel = "All types / सभी प्रकार") {
  return [
    { value: "all", label: allLabel },
    ...RECORD_TYPES.map((t) => ({
      value: t.value,
      label: `${t.en} (${t.hi})`,
    })),
  ];
}

export function recordTypeHint(value?: string | null): string {
  const normalized = normalizeRecordType(value);
  return RECORD_TYPES.find((t) => t.value === normalized)?.hint ?? "";
}

/** Folder / file key used under public/criminals/ */
export function recordStorageKey(input: {
  recordType?: string | null;
  pid?: string | null;
  dagiNumber?: string | null;
}): string {
  const type = normalizeRecordType(input.recordType);
  if (type === "dagi") return String(input.dagiNumber ?? "").trim();
  return String(input.pid ?? "").trim();
}

/** Primary ID shown in tables/PDF filenames */
export function recordPrimaryId(input: {
  recordType?: string | null;
  pid?: string | null;
  dagiNumber?: string | null;
}): string {
  return recordStorageKey(input) || "—";
}

export function recordIdFieldLabel(value?: string | null): {
  en: string;
  hi: string;
} {
  return normalizeRecordType(value) === "dagi"
    ? { en: "Dagi Number", hi: "दागी नंबर" }
    : { en: "PID Number", hi: "PID नंबर" };
}
