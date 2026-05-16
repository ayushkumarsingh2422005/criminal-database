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

interface CaseType {
  id: string;
  name: string;
}

export default function CaseTypesPage() {
  const [items, setItems] = useState<CaseType[]>([]);
  const [name, setName] = useState("");

  async function load() {
    const res = await fetch("/api/case-types");
    if (res.ok) setItems(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/case-types", {
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
    if (!confirm("Remove this case type?")) return;
    await fetch(`/api/case-types/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <section className="w-full space-y-6">
      <PageHeader
        title="Case Type Management"
        subtitle="Manage crime/case types used in criminal records."
        backHref="/admin"
        backLabel="← Admin Control"
      />

      <Card title="Add Case Type">
        <form onSubmit={handleAdd} className="flex flex-wrap items-end gap-3">
          <Input
            label="Case Type Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Burglary"
            className="min-w-[240px] flex-1"
          />
          <Button type="submit">Add</Button>
        </form>
      </Card>

      <Card title="All Case Types" subtitle={`${items.length} case type(s)`}>
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
