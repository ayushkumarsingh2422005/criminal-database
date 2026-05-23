"use client";

import { FormEvent, useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/layout/PageHeader";

export default function VerificationSettingsPage() {
  const [days, setDays] = useState("30");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/settings/verification")
      .then((r) => r.json())
      .then((data) => {
        if (data.verificationFrequencyDays) {
          setDays(String(data.verificationFrequencyDays));
        }
      })
      .catch(() => setError("Failed to load settings"))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/settings/verification", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verificationFrequencyDays: Number(days) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      setMessage("Verification frequency updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="w-full max-w-xl space-y-6">
      <PageHeader
        title="Verification Settings"
        subtitle="How often each criminal must be physically verified."
      />
      <Card title="Verification frequency" subtitle="सत्यापन अंतराल">
        {loading ? (
          <p className="text-sm text-[var(--color-muted)]">Loading...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Days between verifications / सत्यापन के बीच दिन"
              type="number"
              min={1}
              max={365}
              value={days}
              onChange={(e) => setDays(e.target.value)}
              required
            />
            <p className="text-sm text-[var(--color-muted)]">
              Criminals become <strong>due soon</strong> in the last 7 days before this period
              ends, then <strong>overdue</strong> after it passes.
            </p>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            {message ? <p className="text-sm text-green-700">{message}</p> : null}
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save settings"}
            </Button>
          </form>
        )}
      </Card>
    </section>
  );
}
