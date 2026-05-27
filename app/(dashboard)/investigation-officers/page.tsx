"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ActionIcons, IconButton } from "@/components/ui/IconButton";
import { IconTrash, IconUserCheck, IconUserOff } from "@/components/ui/icons";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/layout/PageHeader";
import { usePoliceStations } from "@/lib/hooks/use-lookups";
import { useAppSession } from "@/components/session/SessionProvider";
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeaderCell,
  DataTableRow,
} from "@/components/ui/DataTable";

type IoUser = {
  id: string;
  email: string;
  name: string;
  active: boolean;
  policeStationId?: string;
  policeStationName?: string;
};

export default function InvestigationOfficersPage() {
  const session = useAppSession();
  const isSuperAdmin = session.role === "superadmin";
  const scopedPsId = session.policeStationId ?? "";
  const [ios, setIos] = useState<IoUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [filterPsId, setFilterPsId] = useState(scopedPsId);
  const { items: policeStations } = usePoliceStations();

  async function load() {
    setLoading(true);
    const params = new URLSearchParams();
    const ps = isSuperAdmin ? filterPsId : scopedPsId;
    if (ps) params.set("policeStationId", ps);

    const res = await fetch(`/api/investigation-officers?${params}`);
    if (res.ok) {
      setIos(await res.json());
      setError("");
    } else {
      const data = await res.json();
      setError(data.error ?? "Failed to load investigation officers");
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterPsId, scopedPsId]);

  async function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/investigation-officers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fd.get("name"),
        email: fd.get("email"),
        password: fd.get("password"),
        policeStationId: isSuperAdmin ? fd.get("policeStationId") : scopedPsId,
      }),
    });
    if (res.ok) {
      setModalOpen(false);
      await load();
    } else {
      const data = await res.json();
      alert(data.error ?? "Failed to create IO");
    }
  }

  async function toggleActive(io: IoUser) {
    await fetch(`/api/investigation-officers/${io.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !io.active }),
    });
    await load();
  }

  async function handleDelete(io: IoUser) {
    if (!confirm(`Delete IO ${io.email}?`)) return;
    const res = await fetch(`/api/investigation-officers/${io.id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error);
      return;
    }
    await load();
  }

  return (
    <section className="w-full space-y-6">
      <PageHeader
        title="Investigation Officers"
        subtitle={
          isSuperAdmin
            ? "Manage IO accounts for any police station."
            : `Manage investigation officers for ${session.policeStationName ?? "your PS"}.`
        }
        actions={
          <Button onClick={() => setModalOpen(true)}>+ Add IO</Button>
        }
      />

      {isSuperAdmin && (
        <Card title="Filter by Police Station" subtitle="थाना">
          <Select
            label="Police Station"
            value={filterPsId}
            onChange={(e) => setFilterPsId(e.target.value)}
            options={[
              { value: "", label: "All stations / सभी थाना" },
              ...policeStations.map((s) => ({ value: s.id, label: s.name })),
            ]}
          />
        </Card>
      )}

      <Card title="IO Accounts" subtitle="जांच अधिकारी">
        {loading ? (
          <p className="py-8 text-center text-sm text-[var(--color-muted)]">Loading...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : ios.length === 0 ? (
          <p className="py-8 text-center text-sm text-[var(--color-muted)]">
            No investigation officers yet.
          </p>
        ) : (
          <DataTable>
            <DataTableHead>
              <DataTableHeaderCell>Name</DataTableHeaderCell>
              <DataTableHeaderCell>Email</DataTableHeaderCell>
              {isSuperAdmin && <DataTableHeaderCell>Police Station</DataTableHeaderCell>}
              <DataTableHeaderCell>Status</DataTableHeaderCell>
              <DataTableHeaderCell className="w-[1%]">
                <span className="sr-only">Actions</span>
              </DataTableHeaderCell>
            </DataTableHead>
            <DataTableBody>
              {ios.map((io) => (
                <DataTableRow key={io.id}>
                  <DataTableCell className="font-medium">{io.name}</DataTableCell>
                  <DataTableCell>{io.email}</DataTableCell>
                  {isSuperAdmin && (
                    <DataTableCell>{io.policeStationName ?? "—"}</DataTableCell>
                  )}
                  <DataTableCell>
                    <Badge variant={io.active ? "success" : "default"}>
                      {io.active ? "Active" : "Inactive"}
                    </Badge>
                  </DataTableCell>
                  <DataTableCell>
                    <ActionIcons>
                      <IconButton
                        label={io.active ? "Deactivate" : "Activate"}
                        onClick={() => toggleActive(io)}
                      >
                        {io.active ? <IconUserOff /> : <IconUserCheck />}
                      </IconButton>
                      <IconButton
                        label="Delete IO"
                        variant="danger"
                        onClick={() => handleDelete(io)}
                      >
                        <IconTrash />
                      </IconButton>
                    </ActionIcons>
                  </DataTableCell>
                </DataTableRow>
              ))}
            </DataTableBody>
          </DataTable>
        )}
      </Card>

      {!isSuperAdmin && (
        <p className="text-sm text-[var(--color-muted)]">
          <Link href="/search" className="text-[var(--color-primary)] hover:underline">
            ← Back to Search
          </Link>
        </p>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Investigation Officer / जांच अधिकारी जोड़ें"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Name" name="name" required />
          <Input label="Email" name="email" type="email" required />
          <Input
            label="Password (min 8 characters)"
            name="password"
            type="password"
            required
            minLength={8}
          />
          {isSuperAdmin && (
            <Select
              label="Police Station"
              name="policeStationId"
              required
              options={[
                { value: "", label: "Select station" },
                ...policeStations.map((s) => ({ value: s.id, label: s.name })),
              ]}
            />
          )}
          <footer className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create IO</Button>
          </footer>
        </form>
      </Modal>
    </section>
  );
}
