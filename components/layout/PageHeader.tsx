import Link from "next/link";
import { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  backHref,
  backLabel = "← Back",
  actions,
}: {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-6 flex w-full flex-wrap items-start justify-between gap-4">
      <section className="min-w-0 flex-1">
        {backHref && (
          <Link
            href={backHref}
            className="text-sm font-medium text-[var(--color-primary)] hover:underline"
          >
            {backLabel}
          </Link>
        )}
        <h1 className={`text-2xl font-bold text-slate-900 ${backHref ? "mt-1" : ""}`}>
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-[var(--color-muted)]">{subtitle}</p>
        )}
      </section>
      {actions && <section className="shrink-0">{actions}</section>}
    </header>
  );
}
