"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { CriminalTable } from "@/components/criminals/CriminalTable";
import { CriminalForm } from "@/components/criminals/CriminalForm";
import { PageHeader } from "@/components/layout/PageHeader";
import type { CriminalRecord } from "@/lib/criminal-mapper";
import { useAppSession } from "@/components/session/SessionProvider";

export default function CriminalManagementPage() {
  const session = useAppSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isScopedAdmin = session.role === "admin" && !!session.policeStationId;

  useEffect(() => {
    if (session.role === "io") router.replace("/search");
  }, [session.role, router]);

  const editId = searchParams.get("edit");

  const [items, setItems] = useState<CriminalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<CriminalRecord | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/criminals?limit=100");
    const data = await res.json();
    setItems(data.items ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!editId) return;
    fetch(`/api/criminals/${editId}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) {
          setEditing(data);
          setFormOpen(true);
        }
      });
  }, [editId]);

  async function handleSave(data: Record<string, unknown>) {
    const url = editing ? `/api/criminals/${editing.id}` : "/api/criminals";
    const method = editing ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error ?? "Save failed");
    setFormOpen(false);
    setEditing(null);
    if (editId) router.replace("/criminals");
    await load();
  }

  async function handleDelete(c: CriminalRecord) {
    if (!confirm(`Delete record for ${c.name}?`)) return;
    const res = await fetch(`/api/criminals/${c.id}`, { method: "DELETE" });
    if (res.ok) await load();
  }

  return (
    <section className="w-full space-y-6">
      <PageHeader
        title="Criminal Management"
        subtitle={
          isScopedAdmin
            ? `अपराधी प्रबंधन — ${session.policeStationName ?? "your PS"} only`
            : "अपराधी प्रबंधन — add, edit, delete records with photos in /public."
        }
        actions={
          <Button
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            + Add Criminal
          </Button>
        }
      />

      <Card title="All Criminal Records" subtitle="सभी अपराधी रिकॉर्ड">
        <CriminalTable
          items={items}
          loading={loading}
          showActions
          linkToDetail
          onEdit={(c) => {
            setEditing(c);
            setFormOpen(true);
          }}
          onDelete={handleDelete}
        />
      </Card>

      <Modal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        title={editing ? "Edit Criminal / संपादित करें" : "Add Criminal / नया जोड़ें"}
        size="xl"
      >
        <CriminalForm
          initial={editing ?? undefined}
          onSubmit={handleSave}
          onCancel={() => {
            setFormOpen(false);
            setEditing(null);
          }}
        />
      </Modal>
    </section>
  );
}
