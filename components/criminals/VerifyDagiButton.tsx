"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import type { CriminalRecord } from "@/lib/criminal-mapper";

export function VerifyDagiButton({
  criminalId,
  onVerified,
  withRemark = false,
}: {
  criminalId: string;
  onVerified?: (record: CriminalRecord) => void;
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
      const res = await fetch(`/api/criminals/${criminalId}/verify-dagi`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          verifiedAt: new Date().toISOString(),
          ...(remarkText?.trim() ? { remark: remarkText.trim() } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Dagi verification failed");
      onVerified?.(data);
      setModalOpen(false);
      setRemark("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Dagi verification failed");
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

  return (
    <section className="space-y-2">
      <Button type="button" variant="primary" size="sm" disabled={loading} onClick={handleClick}>
        {loading ? "Saving..." : "Verify Dagi / दागी सत्यापित करें"}
      </Button>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {withRemark ? (
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Verify Dagi / दागी सत्यापित करें"
        >
          <section className="space-y-4">
            <Input
              label="Remark (optional) / टिप्पणी"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="Dagi field verification notes..."
            />
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <footer className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="button" disabled={loading} onClick={() => submitVerify(remark)}>
                {loading ? "Saving..." : "Confirm Dagi verify"}
              </Button>
            </footer>
          </section>
        </Modal>
      ) : null}
    </section>
  );
}
