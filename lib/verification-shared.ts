import type { VerificationRecord } from "@/models/Criminal";

export type VerificationStatus = "overdue" | "due_soon" | "current" | "never";

const DUE_SOON_DAYS_BEFORE = 7;

export const DEFAULT_VERIFICATION_SEED_DATE = "2026-01-01T00:00:00.000Z";

export const DEFAULT_VERIFICATION_FREQUENCY_DAYS = 30;

export function sortVerificationHistory(
  history: VerificationRecord[]
): VerificationRecord[] {
  return [...history].sort(
    (a, b) => new Date(b.verifiedAt).getTime() - new Date(a.verifiedAt).getTime()
  );
}

export function getLastVerification(
  history: VerificationRecord[] | undefined
): VerificationRecord | null {
  const sorted = sortVerificationHistory(history ?? []);
  return sorted[0] ?? null;
}

export function getVerificationStatus(
  history: VerificationRecord[] | undefined,
  frequencyDays: number
): VerificationStatus {
  const last = getLastVerification(history);
  if (!last?.verifiedAt) return "never";

  const lastDate = new Date(last.verifiedAt);
  if (Number.isNaN(lastDate.getTime())) return "never";

  const now = new Date();
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysSince = (now.getTime() - lastDate.getTime()) / msPerDay;

  if (daysSince > frequencyDays) return "overdue";
  if (daysSince > frequencyDays - DUE_SOON_DAYS_BEFORE) return "due_soon";
  return "current";
}

export function getNextVerificationDue(
  history: VerificationRecord[] | undefined,
  frequencyDays: number
): string | undefined {
  const last = getLastVerification(history);
  if (!last?.verifiedAt) return undefined;
  const lastDate = new Date(last.verifiedAt);
  if (Number.isNaN(lastDate.getTime())) return undefined;
  const due = new Date(lastDate.getTime() + frequencyDays * 24 * 60 * 60 * 1000);
  return due.toISOString();
}

export function getDaysSinceVerification(lastVerifiedAt?: string): number | null {
  if (!lastVerifiedAt) return null;
  const lastDate = new Date(lastVerifiedAt);
  if (Number.isNaN(lastDate.getTime())) return null;
  const msPerDay = 24 * 60 * 60 * 1000;
  return (Date.now() - lastDate.getTime()) / msPerDay;
}

export function getOverdueByDays(
  lastVerifiedAt: string | undefined,
  frequencyDays: number
): number | null {
  const daysSince = getDaysSinceVerification(lastVerifiedAt);
  if (daysSince == null) return null;
  const overdue = daysSince - frequencyDays;
  return overdue > 0 ? Math.ceil(overdue) : null;
}

export function getDaysUntilDue(
  lastVerifiedAt: string | undefined,
  frequencyDays: number
): number | null {
  const daysSince = getDaysSinceVerification(lastVerifiedAt);
  if (daysSince == null) return null;
  const remaining = frequencyDays - daysSince;
  return remaining > 0 ? Math.ceil(remaining) : null;
}

export type VerificationSummary = {
  status: VerificationStatus;
  kind: VerificationStatus;
  lastVerifiedAt?: string;
  overdueByDays?: number;
  daysUntilDue?: number;
};

export function buildVerificationSummary(input: {
  verificationStatus?: VerificationStatus;
  lastVerifiedAt?: string;
  verificationFrequencyDays?: number;
}): VerificationSummary | null {
  const status = input.verificationStatus;
  if (!status) return null;

  const frequencyDays = input.verificationFrequencyDays ?? DEFAULT_VERIFICATION_FREQUENCY_DAYS;
  const lastAt = input.lastVerifiedAt;

  if (status === "overdue") {
    const overdueByDays = getOverdueByDays(lastAt, frequencyDays) ?? undefined;
    return { status, kind: "overdue", lastVerifiedAt: lastAt, overdueByDays };
  }

  if (status === "due_soon") {
    const daysUntilDue = getDaysUntilDue(lastAt, frequencyDays) ?? undefined;
    return { status, kind: "due_soon", lastVerifiedAt: lastAt, daysUntilDue };
  }

  if (status === "current") {
    return { status, kind: "current", lastVerifiedAt: lastAt };
  }

  return { status, kind: "never" };
}

export function parseVerificationHistoryInput(raw: unknown): VerificationRecord[] {
  if (!Array.isArray(raw)) return [];
  const result: VerificationRecord[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const verifiedAt = o.verifiedAt ? String(o.verifiedAt).trim() : "";
    const officerName = o.officerName ? String(o.officerName).trim() : "";
    if (!verifiedAt || !officerName) continue;
    const officerId = o.officerId ? String(o.officerId).trim() : undefined;
    result.push({
      verifiedAt,
      officerName,
      ...(officerId ? { officerId } : {}),
    });
  }
  return sortVerificationHistory(result);
}

export function parseVerifiedAtFromClient(value: unknown): string {
  if (value == null || value === "") return new Date().toISOString();
  const d = new Date(String(value));
  if (Number.isNaN(d.getTime())) {
    throw new Error("Invalid verification date/time");
  }
  const now = Date.now();
  const maxFuture = now + 5 * 60 * 1000;
  if (d.getTime() > maxFuture) {
    throw new Error("Verification time cannot be in the future");
  }
  return d.toISOString();
}

export const VERIFICATION_STATUS_LABELS: Record<
  VerificationStatus,
  { en: string; hi: string; variant: "danger" | "warning" | "success" | "default" }
> = {
  overdue: {
    en: "Overdue verification",
    hi: "सत्यापन अतिदेय",
    variant: "danger",
  },
  due_soon: {
    en: "Verification due soon",
    hi: "शीघ्र सत्यापन आवश्यक",
    variant: "warning",
  },
  current: {
    en: "Verification up to date",
    hi: "सत्यापन अद्यतन",
    variant: "success",
  },
  never: {
    en: "Never verified",
    hi: "कभी सत्यापित नहीं",
    variant: "default",
  },
};

export type VerificationEnrichment = {
  verificationHistory: VerificationRecord[];
  verificationStatus: VerificationStatus;
  verificationFrequencyDays: number;
  lastVerifiedAt?: string;
  nextVerificationDue?: string;
};
