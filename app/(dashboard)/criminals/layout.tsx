import { Suspense } from "react";

export default function CriminalsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<p className="p-6 text-sm text-[var(--color-muted)]">Loading...</p>}>{children}</Suspense>;
}
