"use client";

import { VerificationStatusBadge } from "@/components/criminals/VerificationStatusBadge";
import { formatDateDisplay } from "@/lib/date-utils";
import type { CriminalVerificationMeta } from "@/lib/criminal-verification-types";
import { buildVerificationSummary } from "@/lib/verification-shared";

function verificationDetail(summary: NonNullable<ReturnType<typeof buildVerificationSummary>>): {
  en: string;
  hi: string;
  warn?: boolean;
} {
  switch (summary.kind) {
    case "current":
      return summary.lastVerifiedAt
        ? {
            en: `Last verified ${formatDateDisplay(summary.lastVerifiedAt)}`,
            hi: `अंतिम सत्यापन ${formatDateDisplay(summary.lastVerifiedAt)}`,
          }
        : {
            en: "Verification up to date",
            hi: "सत्यापन अद्यतन",
          };
    case "overdue": {
      const days = summary.overdueByDays ?? 0;
      return {
        en: `Overdue by ${days} day${days === 1 ? "" : "s"}`,
        hi: `${days} दिन से अतिदेय`,
      };
    }
    case "due_soon":
      return {
        en:
          summary.daysUntilDue != null
            ? `Need verification — ${summary.daysUntilDue} day${summary.daysUntilDue === 1 ? "" : "s"} left`
            : "Need verification",
        hi:
          summary.daysUntilDue != null
            ? `सत्यापन आवश्यक — ${summary.daysUntilDue} दिन शेष`
            : "सत्यापन आवश्यक",
        warn: true,
      };
    case "never":
      return {
        en: "Never verified",
        hi: "कभी सत्यापित नहीं",
      };
  }
}

export function VerificationStatusCell({
  criminal,
}: {
  criminal: CriminalVerificationMeta;
}) {
  const summary = buildVerificationSummary(criminal);
  if (!summary) return <>—</>;

  const detail = verificationDetail(summary);

  return (
    <section className="space-y-1">
      <VerificationStatusBadge status={summary.status} compact />
      <p
        className={`text-xs leading-snug ${
          detail.warn ? "font-medium text-amber-700" : "text-[var(--color-muted)]"
        }`}
      >
        <span className="block">{detail.en}</span>
        <span className="block">{detail.hi}</span>
      </p>
    </section>
  );
}
