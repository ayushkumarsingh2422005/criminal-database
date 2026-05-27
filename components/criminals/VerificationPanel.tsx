"use client";

import { SectionTitle } from "@/components/ui/FieldLabel";
import { VerificationStatusBadge } from "@/components/criminals/VerificationStatusBadge";
import { VerifyCriminalButton } from "@/components/criminals/VerifyCriminalButton";
import { formatDateTimeDisplay } from "@/lib/date-utils";
import type { CriminalRecord } from "@/lib/criminal-mapper";

export function VerificationPanel({
  criminal,
  showVerifyButton = true,
  onVerified,
}: {
  criminal: CriminalRecord;
  showVerifyButton?: boolean;
  onVerified?: (record: CriminalRecord) => void;
}) {
  const history = criminal.verificationHistory ?? [];

  return (
    <section className="space-y-4">
      <section className="flex flex-wrap items-center justify-between gap-3">
        <SectionTitle en="Physical Verification" hi="भौतिक सत्यापन" />
        {criminal.verificationStatus ? (
          <VerificationStatusBadge status={criminal.verificationStatus} />
        ) : null}
      </section>

      <section className="grid gap-2 rounded-lg border border-[var(--color-border)] bg-slate-50 p-4 text-sm">
        <p>
          <span className="font-medium text-slate-700">Frequency / अंतराल: </span>
          Every {criminal.verificationFrequencyDays ?? 30} days
        </p>
        <p>
          <span className="font-medium text-slate-700">Last verified / अंतिम सत्यापन: </span>
          {criminal.lastVerifiedAt
            ? formatDateTimeDisplay(criminal.lastVerifiedAt)
            : "—"}
        </p>
        {criminal.nextVerificationDue ? (
          <p>
            <span className="font-medium text-slate-700">Next due / अगली तिथि: </span>
            {formatDateTimeDisplay(criminal.nextVerificationDue)}
          </p>
        ) : null}
      </section>

      {showVerifyButton ? (
        <VerifyCriminalButton criminalId={criminal.id} onVerified={onVerified} />
      ) : null}

      <section className="space-y-2">
        <h4 className="text-sm font-semibold text-slate-800">
          Verification history / सत्यापन इतिहास
        </h4>
        {history.length === 0 ? (
          <p className="text-sm text-[var(--color-muted)]">No verification records yet.</p>
        ) : (
          <ul className="divide-y divide-[var(--color-border)] rounded-lg border border-[var(--color-border)]">
            {history.map((row, i) => (
              <li key={`${row.verifiedAt}-${i}`} className="px-4 py-3 text-sm">
                <p className="font-medium text-slate-900">
                  {formatDateTimeDisplay(row.verifiedAt)}
                </p>
                <p className="text-[var(--color-muted)]">
                  Officer / अधिकारी: {row.officerName}
                </p>
                {row.remark ? (
                  <p className="mt-1 text-[var(--color-muted)]">
                    Remark / टिप्पणी: {row.remark}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  );
}
