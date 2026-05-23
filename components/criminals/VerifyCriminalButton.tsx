"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { IconCheck } from "@/components/ui/icons";
import type { CriminalRecord } from "@/lib/criminal-mapper";

export function VerifyCriminalButton({
  criminalId,
  onVerified,
  variant = "inline",
}: {
  criminalId: string;
  onVerified?: (record: CriminalRecord) => void;
  variant?: "inline" | "fab";
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleVerify() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/criminals/${criminalId}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verifiedAt: new Date().toISOString() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Verification failed");
      onVerified?.(data);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  if (variant === "fab") {
    return (
      <>
        <button
          type="button"
          aria-label="Verify now / अभी सत्यापित करें"
          title="Verify now / अभी सत्यापित करें"
          disabled={loading}
          onClick={handleVerify}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-4 py-3.5 text-white shadow-lg transition hover:bg-[var(--color-primary-dark)] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <IconCheck className="h-5 w-5 shrink-0" />
          <span className="text-sm font-semibold">
            {loading ? "Saving..." : "Verify / सत्यापित"}
          </span>
        </button>
        {error ? (
          <p
            role="alert"
            className="fixed bottom-24 right-6 z-50 max-w-xs rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 shadow-md"
          >
            {error}
          </p>
        ) : null}
      </>
    );
  }

  return (
    <section className="space-y-2">
      <Button type="button" variant="primary" size="sm" disabled={loading} onClick={handleVerify}>
        {loading ? "Saving..." : "Verify now / अभी सत्यापित करें"}
      </Button>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </section>
  );
}
