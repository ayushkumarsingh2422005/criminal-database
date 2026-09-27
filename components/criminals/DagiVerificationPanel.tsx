"use client";

import { SectionTitle } from "@/components/ui/FieldLabel";
import { VerificationStatusBadge } from "@/components/criminals/VerificationStatusBadge";
import { VerifyDagiButton } from "@/components/criminals/VerifyDagiButton";
import { formatDateTimeDisplay } from "@/lib/date-utils";
import type { CriminalRecord } from "@/lib/criminal-mapper";

export function DagiVerificationPanel({
  criminal,
  showVerifyButton = true,
  onVerified,
}: {
  criminal: CriminalRecord;
  showVerifyButton?: boolean;
  onVerified?: (record: CriminalRecord) => void;
}) {
  const history = criminal.dagiVerificationHistory ?? [];

  return (
    <section className="space-y-4">
      <section className="flex flex-wrap items-center justify-between gap-3">
        <SectionTitle en="Dagi Physical Verification" hi="दागी भौतिक सत्यापन" />
        {criminal.dagiVerificationStatus ? (
          <VerificationStatusBadge status={criminal.dagiVerificationStatus} />
        ) : null}
      </section>

      <section className="grid gap-2 rounded-lg border border-amber-200 bg-amber-50/50 p-4 text-sm">
        <p>
          <span className="font-medium text-slate-700">Dagi number / दागी नंबर: </span>
          {criminal.dagiNumber || "—"}
        </p>
        <p>
          <span className="font-medium text-slate-700">Frequency / अंतराल: </span>
          Every {criminal.dagiVerificationFrequencyDays ?? 30} days
        </p>
        <p>
          <span className="font-medium text-slate-700">Last verified / अंतिम सत्यापन: </span>
          {criminal.dagiLastVerifiedAt
            ? formatDateTimeDisplay(criminal.dagiLastVerifiedAt)
            : "—"}
        </p>
        {criminal.dagiNextVerificationDue ? (
          <p>
            <span className="font-medium text-slate-700">Next due / अगली तिथि: </span>
            {formatDateTimeDisplay(criminal.dagiNextVerificationDue)}
          </p>
        ) : null}
      </section>

      {showVerifyButton ? (
        <VerifyDagiButton criminalId={criminal.id} onVerified={onVerified} />
      ) : null}

      <section className="space-y-2">
        <h4 className="text-sm font-semibold text-slate-800">
          Dagi verification history / दागी सत्यापन इतिहास
        </h4>
        {history.length === 0 ? (
          <p className="text-sm text-[var(--color-muted)]">No Dagi verification records yet.</p>
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
