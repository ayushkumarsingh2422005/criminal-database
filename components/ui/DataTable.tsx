import { ReactNode } from "react";

export function DataTable({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`w-full overflow-x-auto ${className}`}>
      <table className="w-full text-left text-sm">
        {children}
      </table>
    </section>
  );
}

export function DataTableHead({ children }: { children: ReactNode }) {
  return (
    <thead>
      <tr className="border-b border-[var(--color-border)] bg-slate-50">
        {children}
      </tr>
    </thead>
  );
}

export function DataTableHeaderCell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)] ${className}`}
    >
      {children}
    </th>
  );
}

export function DataTableBody({ children }: { children: ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function DataTableRow({ children }: { children: ReactNode }) {
  return (
    <tr className="border-b border-[var(--color-border)] hover:bg-slate-50/80">
      {children}
    </tr>
  );
}

export function DataTableCell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <td className={`px-4 py-3 align-middle ${className}`}>{children}</td>;
}
