"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeaderCell,
  DataTableRow,
} from "@/components/ui/DataTable";
import { fieldLabel } from "@/lib/criminal-fields";
import type { CriminalRecord } from "@/lib/criminal-mapper";

export function CriminalTable({
  items,
  loading,
  onView,
  onEdit,
  onDelete,
  showActions = false,
  linkToDetail = true,
}: {
  items: CriminalRecord[];
  loading?: boolean;
  onView?: (c: CriminalRecord) => void;
  onEdit?: (c: CriminalRecord) => void;
  onDelete?: (c: CriminalRecord) => void;
  showActions?: boolean;
  linkToDetail?: boolean;
}) {
  if (loading) {
    return (
      <p className="py-12 text-center text-sm text-[var(--color-muted)]">
        Loading records...
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-[var(--color-muted)]">
        No criminal records found.
      </p>
    );
  }

  return (
    <DataTable>
      <DataTableHead>
        <DataTableHeaderCell>{fieldLabel("pid")}</DataTableHeaderCell>
        <DataTableHeaderCell>{fieldLabel("name")}</DataTableHeaderCell>
        <DataTableHeaderCell>{fieldLabel("crimeTypes")}</DataTableHeaderCell>
        <DataTableHeaderCell>{fieldLabel("mobileNumber")}</DataTableHeaderCell>
        <DataTableHeaderCell>{fieldLabel("casePS")}</DataTableHeaderCell>
        <DataTableHeaderCell>{fieldLabel("fatherName")}</DataTableHeaderCell>
        <DataTableHeaderCell>
          {showActions ? "Actions" : "View"}
        </DataTableHeaderCell>
      </DataTableHead>
      <DataTableBody>
        {items.map((c) => (
          <DataTableRow key={c.id}>
            <DataTableCell className="font-mono">
              {linkToDetail ? (
                <Link
                  href={`/criminals/${c.id}`}
                  className="font-medium text-[var(--color-primary)] hover:underline"
                >
                  {c.pid}
                </Link>
              ) : (
                c.pid
              )}
            </DataTableCell>
            <DataTableCell className="font-medium">
              {linkToDetail ? (
                <Link
                  href={`/criminals/${c.id}`}
                  className="text-[var(--color-primary)] hover:underline"
                >
                  {c.name}
                </Link>
              ) : (
                c.name
              )}
            </DataTableCell>
            <DataTableCell>
              <span className="line-clamp-2 text-xs">
                {c.crimeTypes.join(", ") || "—"}
              </span>
            </DataTableCell>
            <DataTableCell>{c.mobileNumber ?? "—"}</DataTableCell>
            <DataTableCell>
              {c.permanentAddress?.thana ?? c.presentAddress?.thana ?? "—"}
            </DataTableCell>
            <DataTableCell>{c.fatherName ?? "—"}</DataTableCell>
            <DataTableCell>
              {showActions ? (
                <section className="flex flex-wrap gap-2">
                    {linkToDetail ? (
                      <Link href={`/criminals/${c.id}`}>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </Link>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => onView?.(c)}>
                        View
                      </Button>
                    )}
                  {onEdit && (
                    <Button size="sm" variant="outline" onClick={() => onEdit(c)}>
                      Edit
                    </Button>
                  )}
                  {onDelete && (
                    <Button size="sm" variant="danger" onClick={() => onDelete(c)}>
                      Delete
                    </Button>
                  )}
                </section>
              ) : linkToDetail ? (
                <Link href={`/criminals/${c.id}`}>
                  <Button size="sm">View Criminal</Button>
                </Link>
              ) : (
                <Button size="sm" onClick={() => onView?.(c)}>
                  View Criminal
                </Button>
              )}
            </DataTableCell>
          </DataTableRow>
        ))}
      </DataTableBody>
    </DataTable>
  );
}
