"use client";

import { ReactNode, useEffect } from "react";
import { Button } from "./Button";

export function Modal({
  open,
  onClose,
  title,
  children,
  size = "lg",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: "md" | "lg" | "xl";
}) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const widths = { md: "max-w-lg", lg: "max-w-3xl", xl: "max-w-5xl" };

  return (
    <section
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close modal"
      />
      <article
        className={`relative z-10 flex w-full ${widths[size]} max-h-[90vh] flex-col overflow-hidden rounded-xl bg-white shadow-xl`}
      >
        <header className="flex shrink-0 items-center justify-between border-b border-[var(--color-border)] px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close">
            ✕
          </Button>
        </header>
        <section className="min-h-0 flex-1 overflow-y-auto p-6">{children}</section>
      </article>
    </section>
  );
}
