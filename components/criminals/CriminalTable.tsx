"use client";

import Link from "next/link";
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeaderCell,
  DataTableRow,
} from "@/components/ui/DataTable";
import { ActionIcons, IconButton } from "@/components/ui/IconButton";
import { IconEye, IconPencil, IconTrash } from "@/components/ui/icons";
import { aggregateCrimeTypes } from "@/lib/criminal-history-utils";
import { fieldLabel } from "@/lib/criminal-fields";
import type { CriminalRecord } from "@/lib/criminal-mapper";
import { VerificationStatusCell } from "@/components/criminals/VerificationStatusCell";
import { DownloadPdfButton } from "./DownloadPdfButton";

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
        <DataTableHeaderCell>{fieldLabel("addressPoliceStation")}</DataTableHeaderCell>
        <DataTableHeaderCell>Verification</DataTableHeaderCell>
        <DataTableHeaderCell className="w-[1%] whitespace-nowrap">
          <span className="sr-only">Actions</span>
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
                  <span className="block">{c.name}</span>
                  {c.fatherName ? (
                    <span className="mt-0.5 block text-xs font-normal text-[var(--color-muted)]">
                      S/O {c.fatherName}
                    </span>
                  ) : null}
                </Link>
              ) : (
                <>
                  <span className="block">{c.name}</span>
                  {c.fatherName ? (
                    <span className="mt-0.5 block text-xs font-normal text-[var(--color-muted)]">
                      S/O {c.fatherName}
                    </span>
                  ) : null}
                </>
              )}
            </DataTableCell>
            <DataTableCell>
              <span className="line-clamp-2 text-xs">
                {aggregateCrimeTypes(c.criminalHistory).join(", ") || "—"}
              </span>
            </DataTableCell>
            <DataTableCell>{c.mobileNumber ?? "—"}</DataTableCell>
            <DataTableCell>
              {(() => {
                const perm = c.permanentAddress?.thana;
                const pres = c.presentAddress?.thana;
                if (perm && pres && perm !== pres) {
                  return (
                    <span className="text-xs leading-snug">
                      <span className="block">Perm: {perm}</span>
                      <span className="block text-[var(--color-muted)]">Pres: {pres}</span>
                    </span>
                  );
                }
                return perm ?? pres ?? "—";
              })()}
            </DataTableCell>
            <DataTableCell>
              <VerificationStatusCell criminal={c} />
            </DataTableCell>
            <DataTableCell>
              <ActionIcons>
                {linkToDetail ? (
                  <IconButton
                    label="View criminal"
                    href={`/criminals/${c.id}`}
                    variant={showActions ? "outline" : "primary"}
                  >
                    <IconEye />
                  </IconButton>
                ) : (
                  <IconButton
                    label="View criminal"
                    variant={showActions ? "outline" : "primary"}
                    onClick={() => onView?.(c)}
                  >
                    <IconEye />
                  </IconButton>
                )}
                <DownloadPdfButton criminalId={c.id} pid={c.pid} />
                {showActions && onEdit && (
                  <IconButton label="Edit criminal" onClick={() => onEdit(c)}>
                    <IconPencil />
                  </IconButton>
                )}
                {showActions && onDelete && (
                  <IconButton
                    label="Delete criminal"
                    variant="danger"
                    onClick={() => onDelete(c)}
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
  );
}
