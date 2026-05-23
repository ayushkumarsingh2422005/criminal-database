import type { CriminalHistoryRecord } from "@/lib/criminal-mapper";

/** Unique crime types from criminal history rows (replaces top-level crimeTypes). */
export function aggregateCrimeTypes(
  history: Pick<CriminalHistoryRecord, "crimeType">[]
): string[] {
  const set = new Set<string>();
  for (const row of history) {
    const value = row.crimeType?.trim();
    if (value) set.add(value);
  }
  return [...set];
}

export function extractYearFromDate(value?: string): string | undefined {
  if (!value?.trim()) return undefined;
  const match = value.trim().match(/\b(19|20)\d{2}\b/);
  return match?.[0];
}
