/**
 * Record classification:
 * - Every person is a Criminal (PID required).
 * - Dagi is a subset of Criminal (checkbox: "is also a Dagi").
 * - When marked Dagi: Dagi number + verification interval
 *   (मासिक / त्रैमासिक / वार्षिक only).
 */

/** Fixed Dagi verification intervals from SP note. */
export const DAGI_VERIFICATION_INTERVALS = [
  {
    value: 30,
    key: "monthly",
    en: "Monthly",
    hi: "मासिक",
  },
  {
    value: 90,
    key: "quarterly",
    en: "Quarterly",
    hi: "त्रैमासिक",
  },
  {
    value: 365,
    key: "yearly",
    en: "Yearly",
    hi: "वार्षिक",
  },
] as const;

export type DagiVerificationIntervalDays =
  (typeof DAGI_VERIFICATION_INTERVALS)[number]["value"];

export const DEFAULT_DAGI_VERIFICATION_FREQUENCY_DAYS: DagiVerificationIntervalDays = 30;

const VALID_DAGI_DAYS = new Set<number>(
  DAGI_VERIFICATION_INTERVALS.map((i) => i.value)
);

export type RecordType = "criminal" | "dagi";

export const DEFAULT_RECORD_TYPE: RecordType = "criminal";

export function normalizeRecordType(value?: string | null): RecordType {
  const v = value?.trim().toLowerCase();
  return v === "dagi" ? "dagi" : "criminal";
}

/** Marked as Dagi (subset of criminals). */
export function isDagi(value?: string | null): boolean {
  return normalizeRecordType(value) === "dagi";
}

export function recordTypeLabel(value?: string | null): string {
  return isDagi(value)
    ? "Dagi (Criminal) / दागी (अपराधी)"
    : "Criminal / अपराधी";
}

export function recordTypeBadgeLabel(value?: string | null): string {
  return isDagi(value) ? "Dagi" : "Criminal";
}

export function recordTypeSelectOptions(allLabel = "All / सभी") {
  return [
    { value: "all", label: allLabel },
    {
      value: "criminal",
      label: "Criminal only / केवल अपराधी (not Dagi)",
    },
    {
      value: "dagi",
      label: "Dagi / दागी (subset of Criminal)",
    },
  ];
}

/** Folder under public/criminals/ — always PID. */
export function recordStorageKey(input: {
  pid?: string | null;
}): string {
  return String(input.pid ?? "").trim();
}

export function recordPrimaryId(input: {
  pid?: string | null;
}): string {
  return recordStorageKey(input) || "—";
}

export function recordIdFieldLabel(): { en: string; hi: string } {
  return { en: "PID Number", hi: "PID नंबर" };
}

export function dagiVerificationIntervalSelectOptions() {
  return DAGI_VERIFICATION_INTERVALS.map((i) => ({
    value: String(i.value),
    label: `${i.en} / ${i.hi}`,
  }));
}

export function dagiVerificationIntervalLabel(days?: number | null): string {
  const row = DAGI_VERIFICATION_INTERVALS.find((i) => i.value === days);
  if (!row) return days ? `Every ${days} days` : "—";
  return `${row.en} / ${row.hi} (${row.value} days)`;
}

/** Only मासिक(30) / त्रैमासिक(90) / वार्षिक(365) are allowed. */
export function normalizeDagiVerificationFrequencyDays(
  value: unknown,
  fallback: DagiVerificationIntervalDays = DEFAULT_DAGI_VERIFICATION_FREQUENCY_DAYS
): DagiVerificationIntervalDays {
  const n = Number(value);
  if (VALID_DAGI_DAYS.has(n)) return n as DagiVerificationIntervalDays;
  return fallback;
}

export function isValidDagiVerificationFrequencyDays(value: unknown): boolean {
  return VALID_DAGI_DAYS.has(Number(value));
}
