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
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeaderCell,
  DataTableRow,
} from "@/components/ui/DataTable";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "superadmin" | "admin";
  active: boolean;
  policeStationId?: string;
  policeStationName?: string;
}

export default function AdminUsersPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [createRole, setCreateRole] = useState<"admin" | "superadmin">("admin");
  const { items: policeStations } = usePoliceStations();
  const [currentUser, setCurrentUser] = useState<{ id: string; role: string } | null>(
    null
  );

  async function load() {
    const [meRes, adminsRes] = await Promise.all([
      fetch("/api/auth/me"),
      fetch("/api/admins"),
    ]);
    const me = await meRes.json();
    setCurrentUser(me);

    if (me.role !== "superadmin") {
      setError("Superadmin access required");
      setLoading(false);
      return;
    }

    if (adminsRes.ok) {
      setAdmins(await adminsRes.json());
    } else {
      const data = await adminsRes.json();
      setError(data.error ?? "Failed to load admins");
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/admins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fd.get("name"),
        email: fd.get("email"),
        password: fd.get("password"),
        role: fd.get("role"),
        policeStationId: fd.get("policeStationId"),
      }),
    });
    if (res.ok) {
      setModalOpen(false);
      await load();
    } else {
      const data = await res.json();
      alert(data.error ?? "Failed to create admin");
    }
  }

  async function toggleActive(admin: AdminUser) {
    await fetch(`/api/admins/${admin.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !admin.active }),
    });
    await load();
  }

  async function handleDelete(admin: AdminUser) {
    if (!confirm(`Delete admin ${admin.email}?`)) return;
    const res = await fetch(`/api/admins/${admin.id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error);
      return;
    }
    await load();
  }

  if (loading) {
    return (
      <p className="w-full py-12 text-center text-sm text-[var(--color-muted)]">
        Loading...
      </p>
    );
  }

  if (error) {
    return (
      <section className="w-full space-y-4">
        <Card>
          <p className="text-red-600">{error}</p>
          <Link
            href="/admin"
            className="mt-4 inline-block text-sm text-[var(--color-primary)]"
          >
            ← Back to Admin Control
          </Link>
        </Card>
      </section>
    );
  }

  return (
    <section className="w-full space-y-6">
      <PageHeader
        title="Admin Management"
        subtitle="Manage who can access the criminal database."
        backHref="/admin"
        backLabel="← Admin Control"
        actions={<Button onClick={() => setModalOpen(true)}>+ Add Admin</Button>}
      />

      <Card title="All Admins" subtitle="System administrators with access to this app">
        <DataTable>
          <DataTableHead>
            <DataTableHeaderCell className="w-[18%]">Name</DataTableHeaderCell>
            <DataTableHeaderCell className="w-[24%]">Email</DataTableHeaderCell>
            <DataTableHeaderCell className="w-[12%]">Role</DataTableHeaderCell>
            <DataTableHeaderCell className="w-[18%]">Police Station</DataTableHeaderCell>
            <DataTableHeaderCell className="w-[12%]">Status</DataTableHeaderCell>
            <DataTableHeaderCell className="w-[22%]">Actions</DataTableHeaderCell>
          </DataTableHead>
          <DataTableBody>
            {admins.map((a) => (
              <DataTableRow key={a.id}>
                <DataTableCell className="font-medium">{a.name}</DataTableCell>
                <DataTableCell>{a.email}</DataTableCell>
                <DataTableCell className="capitalize">{a.role}</DataTableCell>
                <DataTableCell>
                  {a.role === "admin"
                    ? a.policeStationName ?? "—"
                    : "All stations"}
                </DataTableCell>
                <DataTableCell>
                  <Badge variant={a.active ? "success" : "danger"}>
                    {a.active ? "Active" : "Inactive"}
                  </Badge>
                </DataTableCell>
                <DataTableCell>
                  <ActionIcons>
                    <IconButton
                      label={a.active ? "Deactivate user" : "Activate user"}
                      variant="outline"
                      onClick={() => toggleActive(a)}
                    >
                      {a.active ? <IconUserOff /> : <IconUserCheck />}
                    </IconButton>
                    {currentUser?.id !== a.id && (
                      <IconButton
                        label="Delete user"
                        variant="danger"
                        onClick={() => handleDelete(a)}
                      >
                        <IconTrash />
                      </IconButton>
                    )}
                  </ActionIcons>
                </DataTableCell>
              </DataTableRow>
            ))}
          </DataTableBody>
        </DataTable>
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Admin">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Name" name="name" required />
          <Input label="Email" name="email" type="email" required />
          <Input label="Password" name="password" type="password" minLength={8} required />
          <Select
            label="Role"
            name="role"
            value={createRole}
            onChange={(e) =>
              setCreateRole(e.target.value as "admin" | "superadmin")
            }
            options={[
              { value: "admin", label: "Admin (single PS)" },
              { value: "superadmin", label: "Super Admin" },
            ]}
          />
          {createRole === "admin" && (
            <Select
              label="Allotted Police Station"
              name="policeStationId"
              required
              options={[
                { value: "", label: "Select station" },
                ...policeStations.map((s) => ({ value: s.id, label: s.name })),
              ]}
            />
          )}
          <Button type="submit" className="w-full">
            Create Admin
          </Button>
        </form>
      </Modal>
    </section>
  );
}
