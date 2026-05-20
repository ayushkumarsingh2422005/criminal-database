"use client";

import { FormEvent, useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ActionIcons, IconButton } from "@/components/ui/IconButton";
import { IconCheck, IconPencil, IconTrash, IconX } from "@/components/ui/icons";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeaderCell,
  DataTableRow,
} from "@/components/ui/DataTable";

interface Station {
  id: string;
  name: string;
}

export default function PoliceStationsPage() {
  const [items, setItems] = useState<Station[]>([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  async function load() {
    const res = await fetch("/api/police-stations");
    if (res.ok) setItems(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/police-stations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (res.ok) {
      setName("");
      await load();
    } else {
      const data = await res.json();
      alert(data.error);
    }
  }

  async function handleSaveEdit(id: string) {
    const res = await fetch(`/api/police-stations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName }),
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error ?? "Failed to update");
      return;
    }
    setEditingId(null);
    setEditName("");
    await load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this police station?")) return;
    const res = await fetch(`/api/police-stations/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error ?? "Failed to remove");
      return;
    }
    await load();
  }

  return (
    <section className="w-full space-y-6">
      <PageHeader
        title="Police Station Management"
        subtitle="Renaming a station updates it everywhere criminals reference it."
        backHref="/admin"
        backLabel="← Admin Control"
      />

      <Card title="Add Police Station">
        <form onSubmit={handleAdd} className="flex flex-wrap items-end gap-3">
          <Input
            label="Station Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Argora"
            className="min-w-[240px] flex-1"
          />
          <Button type="submit">Add</Button>
        </form>
      </Card>

      <Card title="All Police Stations" subtitle={`${items.length} station(s)`}>
        <DataTable>
          <DataTableHead>
            <DataTableHeaderCell className="w-[55%]">Name</DataTableHeaderCell>
            <DataTableHeaderCell className="w-[45%]">Actions</DataTableHeaderCell>
          </DataTableHead>
          <DataTableBody>
            {items.map((item) => (
              <DataTableRow key={item.id}>
                <DataTableCell className="font-medium">
                  {editingId === item.id ? (
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      aria-label="Edit station name"
                    />
                  ) : (
                    item.name
                  )}
                </DataTableCell>
                <DataTableCell>
                  <ActionIcons>
                    {editingId === item.id ? (
                      <>
                        <IconButton
                          label="Save"
                          variant="primary"
                          onClick={() => handleSaveEdit(item.id)}
                        >
                          <IconCheck />
                        </IconButton>
                        <IconButton
                          label="Cancel"
                          variant="outline"
                          onClick={() => {
                            setEditingId(null);
                            setEditName("");
                          }}
                        >
                          <IconX />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <IconButton
                          label="Rename"
                          onClick={() => {
                            setEditingId(item.id);
                            setEditName(item.name);
                          }}
                        >
                          <IconPencil />
                        </IconButton>
                        <IconButton
                          label="Remove"
                          variant="danger"
                          onClick={() => handleDelete(item.id)}
                        >
                          <IconTrash />
                        </IconButton>
                      </>
                    )}
                  </ActionIcons>
                </DataTableCell>
              </DataTableRow>
            ))}
          </DataTableBody>
        </DataTable>
      </Card>
    </section>
  );
}
