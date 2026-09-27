/**
 * Record classification:
 * - Every person is a Criminal (PID required).
 * - Dagi is a subset of Criminal (checkbox: "is also a Dagi").
 * - When marked Dagi: Dagi number + per-record Dagi verification interval.
 */

export const DEFAULT_DAGI_VERIFICATION_FREQUENCY_DAYS = 30;

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

export function normalizeDagiVerificationFrequencyDays(
  value: unknown,
  fallback = DEFAULT_DAGI_VERIFICATION_FREQUENCY_DAYS
): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 1) return fallback;
  return Math.min(3650, Math.floor(n));
}
