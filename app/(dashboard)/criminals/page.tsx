"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { CriminalTable } from "@/components/criminals/CriminalTable";
import { CriminalForm } from "@/components/criminals/CriminalForm";
import { PageHeader } from "@/components/layout/PageHeader";
import type { CriminalRecord } from "@/lib/criminal-mapper";
import { useAppSession } from "@/components/session/SessionProvider";
import { canManageCriminalRecord } from "@/lib/criminal-access-shared";
import {
  normalizeRecordType,
  recordTypeSelectOptions,
} from "@/lib/record-type";

export default function CriminalManagementPage() {
  const session = useAppSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isScopedAdmin = session.role === "admin" && !!session.policeStationId;

  const canManageRecord = (c: CriminalRecord) =>
    canManageCriminalRecord(session.role, session.policeStationId, c);

  useEffect(() => {
    if (session.role === "io") router.replace("/search");
  }, [session.role, router]);

  const editId = searchParams.get("edit");

  const [items, setItems] = useState<CriminalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<CriminalRecord | null>(null);
  const [typeFilter, setTypeFilter] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ limit: "100" });
    if (typeFilter !== "all") params.set("recordType", typeFilter);
    const res = await fetch(`/api/criminals?${params}`);
    const data = await res.json();
    setItems(data.items ?? []);
    setLoading(false);
  }, [typeFilter]);

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

  const formTitle = useMemo(() => {
    if (!editing) return "Add Record / नया जोड़ें";
    const type = normalizeRecordType(editing.recordType);
    return type === "dagi"
      ? "Edit Dagi / दागी संपादित करें"
      : "Edit Criminal / अपराधी संपादित करें";
  }, [editing]);

  return (
    <section className="w-full space-y-6">
      <PageHeader
        title="Criminal / Dagi Management"
        subtitle={
          isScopedAdmin
            ? `View all records — add, edit, and delete only for ${session.policeStationName ?? "your PS"}`
            : session.role === "superadmin"
              ? "अपराधी / दागी प्रबंधन — all police stations (full access)"
              : "अपराधी / दागी प्रबंधन — add, edit, delete records with photos in /public."
        }
        actions={
          <Button
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            + Add Record
          </Button>
        }
      />

      <Card title="All Records" subtitle="सभी रिकॉर्ड — Criminal & Dagi">
        <div className="mb-4 max-w-xs">
          <Select
            label="Record Type / रिकॉर्ड प्रकार"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            options={recordTypeSelectOptions()}
          />
        </div>
        <CriminalTable
          items={items}
          loading={loading}
          showActions
          linkToDetail
          canManageRecord={canManageRecord}
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
        title={formTitle}
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
