"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { IconCheck } from "@/components/ui/icons";
import type { CriminalRecord } from "@/lib/criminal-mapper";

export function VerifyCriminalButton({
  criminalId,
  onVerified,
  variant = "inline",
  withRemark = false,
}: {
  criminalId: string;
  onVerified?: (record: CriminalRecord) => void;
  variant?: "inline" | "fab";
  withRemark?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [remark, setRemark] = useState("");

  async function submitVerify(remarkText?: string) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/criminals/${criminalId}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          verifiedAt: new Date().toISOString(),
          ...(remarkText?.trim() ? { remark: remarkText.trim() } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Verification failed");
      onVerified?.(data);
      setModalOpen(false);
      setRemark("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  function handleClick() {
    if (withRemark) {
      setModalOpen(true);
      return;
    }
    void submitVerify();
  }

  const fab = (
    <>
      <button
        type="button"
        aria-label="Verify now / अभी सत्यापित करें"
        title="Verify now / अभी सत्यापित करें"
        disabled={loading}
        onClick={handleClick}
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

  if (variant === "fab") {
    return (
      <>
        {fab}
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Verify criminal / अपराधी सत्यापित करें"
        >
          <section className="space-y-4">
            <Input
              label="Remark (optional) / टिप्पणी"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="Field verification notes..."
            />
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <footer className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                disabled={loading}
                onClick={() => submitVerify(remark)}
              >
                {loading ? "Saving..." : "Confirm verify"}
              </Button>
            </footer>
          </section>
        </Modal>
      </>
    );
  }

  return (
    <section className="space-y-2">
      <Button type="button" variant="primary" size="sm" disabled={loading} onClick={handleClick}>
        {loading ? "Saving..." : "Verify now / अभी सत्यापित करें"}
      </Button>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {withRemark ? (
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Verify criminal / अपराधी सत्यापित करें"
        >
          <section className="space-y-4">
            <Input
              label="Remark (optional) / टिप्पणी"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />
            <footer className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                disabled={loading}
                onClick={() => submitVerify(remark)}
              >
                {loading ? "Saving..." : "Confirm verify"}
              </Button>
            </footer>
          </section>
        </Modal>
      ) : null}
    </section>
  );
}
