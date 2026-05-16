"use client";

import { FormEvent, useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
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

  async function handleDelete(id: string) {
    if (!confirm("Remove this police station?")) return;
    await fetch(`/api/police-stations/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <section className="w-full space-y-6">
      <PageHeader
        title="Police Station Management"
        subtitle="Manage police stations for the Case PS field."
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
            <DataTableHeaderCell className="w-[70%]">Name</DataTableHeaderCell>
            <DataTableHeaderCell className="w-[30%]">Actions</DataTableHeaderCell>
          </DataTableHead>
          <DataTableBody>
            {items.map((item) => (
              <DataTableRow key={item.id}>
                <DataTableCell className="font-medium">{item.name}</DataTableCell>
                <DataTableCell>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(item.id)}>
                    Remove
                  </Button>
                </DataTableCell>
              </DataTableRow>
            ))}
          </DataTableBody>
        </DataTable>
      </Card>
    </section>
  );
}
