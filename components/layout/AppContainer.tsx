import { ReactNode } from "react";

/** Shared max-width wrapper — use for header and page content so width stays consistent. */
export function AppContainer({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </section>
  );
}
