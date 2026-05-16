export function FieldLabel({
  en,
  hi,
  required,
}: {
  en: string;
  hi: string;
  required?: boolean;
}) {
  return (
    <span className="text-sm font-medium text-slate-700">
      {en}{" "}
      <span className="font-normal text-[var(--color-muted)]">({hi})</span>
      {required && <span className="text-red-500"> *</span>}
    </span>
  );
}

export function SectionTitle({ en, hi }: { en: string; hi: string }) {
  return (
    <h3 className="border-b border-[var(--color-border)] pb-2 text-base font-semibold text-slate-900">
      {en}{" "}
      <span className="text-sm font-normal text-[var(--color-muted)]">({hi})</span>
    </h3>
  );
}
