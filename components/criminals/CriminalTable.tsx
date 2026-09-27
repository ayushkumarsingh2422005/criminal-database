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
import { CriminalStatusBadge } from "@/components/criminals/CriminalStatusBadge";
import { DownloadPdfButton } from "./DownloadPdfButton";
import {
  isDagi,
  recordPrimaryId,
  recordTypeBadgeLabel,
} from "@/lib/record-type";

export function CriminalTable({
  items,
  loading,
  onView,
  onEdit,
  onDelete,
  showActions = false,
  linkToDetail = true,
  canManageRecord,
}: {
  items: CriminalRecord[];
  loading?: boolean;
  onView?: (c: CriminalRecord) => void;
  onEdit?: (c: CriminalRecord) => void;
  onDelete?: (c: CriminalRecord) => void;
  showActions?: boolean;
  linkToDetail?: boolean;
  canManageRecord?: (c: CriminalRecord) => boolean;
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
        No records found.
      </p>
    );
  }

  return (
    <DataTable>
      <DataTableHead>
        <DataTableHeaderCell>Type</DataTableHeaderCell>
        <DataTableHeaderCell>{fieldLabel("pid")}</DataTableHeaderCell>
        <DataTableHeaderCell>Dagi No.</DataTableHeaderCell>
        <DataTableHeaderCell>{fieldLabel("name")}</DataTableHeaderCell>
        <DataTableHeaderCell>{fieldLabel("criminalStatus")}</DataTableHeaderCell>
        <DataTableHeaderCell>{fieldLabel("crimeTypes")}</DataTableHeaderCell>
        <DataTableHeaderCell>{fieldLabel("mobileNumber")}</DataTableHeaderCell>
        <DataTableHeaderCell>{fieldLabel("addressPoliceStation")}</DataTableHeaderCell>
        <DataTableHeaderCell>Verification</DataTableHeaderCell>
        <DataTableHeaderCell className="w-[1%] whitespace-nowrap">
          <span className="sr-only">Actions</span>
        </DataTableHeaderCell>
      </DataTableHead>
      <DataTableBody>
        {items.map((c) => {
          const primaryId = recordPrimaryId(c);
          const markedDagi = isDagi(c.recordType);
          return (
          <DataTableRow key={c.id}>
            <DataTableCell>
              <span
                className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                  markedDagi
                    ? "bg-amber-100 text-amber-900"
                    : "bg-sky-100 text-sky-900"
                }`}
                title={
                  markedDagi
                    ? "Dagi (subset of Criminal)"
                    : "Criminal (not marked Dagi)"
                }
              >
                {recordTypeBadgeLabel(c.recordType)}
              </span>
            </DataTableCell>
            <DataTableCell className="font-mono">
              {linkToDetail ? (
                <Link
                  href={`/criminals/${c.id}`}
                  className="font-medium text-[var(--color-primary)] hover:underline"
                >
                  {primaryId}
                </Link>
              ) : (
                primaryId
              )}
            </DataTableCell>
            <DataTableCell className="font-mono text-xs">
              {markedDagi ? c.dagiNumber || "—" : "—"}
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
              <CriminalStatusBadge status={c.criminalStatus} compact />
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
              {isDagi(c.recordType) && c.dagiVerificationStatus ? (
                <section className="mt-2 border-t border-amber-100 pt-2">
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-amber-800">
                    Dagi
                  </p>
                  <VerificationStatusCell
                    criminal={{
                      verificationHistory: c.dagiVerificationHistory ?? [],
                      verificationStatus: c.dagiVerificationStatus,
                      verificationFrequencyDays: c.dagiVerificationFrequencyDays,
                      lastVerifiedAt: c.dagiLastVerifiedAt,
                      nextVerificationDue: c.dagiNextVerificationDue,
                    }}
                  />
                </section>
              ) : null}
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
                <DownloadPdfButton criminalId={c.id} pid={primaryId} />
                {showActions && onEdit && (!canManageRecord || canManageRecord(c)) && (
                  <IconButton label="Edit criminal" onClick={() => onEdit(c)}>
                    <IconPencil />
                  </IconButton>
                )}
                {showActions && onDelete && (!canManageRecord || canManageRecord(c)) && (
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
          );
        })}
      </DataTableBody>
    </DataTable>
  );
}
