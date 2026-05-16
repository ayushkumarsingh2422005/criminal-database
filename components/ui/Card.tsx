import { ReactNode } from "react";

export function Card({
  children,
  className = "",
  title,
  subtitle,
  action,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <section
      className={`w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-sm ${className}`}
    >
      {(title || action) && (
        <header className="flex items-start justify-between border-b border-[var(--color-border)] px-6 py-4">
          <section>
            {title && (
              <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            )}
            {subtitle && (
              <p className="mt-0.5 text-sm text-[var(--color-muted)]">{subtitle}</p>
            )}
          </section>
          {action}
        </header>
      )}
      <section className="w-full p-6">{children}</section>
    </section>
  );
}
