"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/layout/PageHeader";
import { ActionIcons, IconButton } from "@/components/ui/IconButton";
import { IconCheck, IconTrash, IconX } from "@/components/ui/icons";
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeaderCell,
  DataTableRow,
} from "@/components/ui/DataTable";
import { useAppSession } from "@/components/session/SessionProvider";
import { useTransferPoliceStations } from "@/lib/hooks/use-lookups";
import type { CriminalRecord } from "@/lib/criminal-mapper";

type TransferRow = {
  id: string;
  status: string;
  message?: string;
  createdAt: string;
  respondedAt?: string;
  criminalId: string;
  criminalPid: string;
  criminalName: string;
  fromPoliceStationId: string;
  fromPoliceStationName: string;
  toPoliceStationId: string;
  toPoliceStationName: string;
  requestedByName: string;
  respondedByName?: string;
};

function statusBadge(status: string) {
  switch (status) {
    case "pending":
      return <Badge variant="warning">Pending</Badge>;
    case "accepted":
      return <Badge variant="success">Accepted</Badge>;
    case "rejected":
      return <Badge variant="danger">Rejected</Badge>;
    case "cancelled":
      return <Badge variant="default">Cancelled</Badge>;
    default:
      return <Badge variant="default">{status}</Badge>;
  }
}

function formatWhen(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function TransferPage() {
  const session = useAppSession();
  const { items: targetStations, loading: stationsLoading } =
    useTransferPoliceStations();

  const [outgoing, setOutgoing] = useState<TransferRow[]>([]);
  const [incoming, setIncoming] = useState<TransferRow[]>([]);
  const [criminals, setCriminals] = useState<CriminalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [criminalId, setCriminalId] = useState("");
  const [toPoliceStationId, setToPoliceStationId] = useState("");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [transfersRes, criminalsRes] = await Promise.all([
        fetch("/api/transfers"),
        fetch("/api/criminals?limit=100"),
      ]);
      const transfersData = await transfersRes.json();
      const criminalsData = await criminalsRes.json();

      if (!transfersRes.ok) {
        setError(transfersData.error ?? "Failed to load transfers");
        return;
      }

      const out = transfersData.outgoing ?? [];
      setOutgoing(out);
      setIncoming(transfersData.incoming ?? []);

      const pendingIds = new Set(
        out.filter((t: TransferRow) => t.status === "pending").map((t: TransferRow) => t.criminalId)
      );
      setCriminals(
        (criminalsData.items ?? []).filter((c: CriminalRecord) => !pendingIds.has(c.id))
      );
    } catch {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    if (!criminalId || !toPoliceStationId) {
      alert("Select a criminal and target police station");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/transfers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          criminalId,
          toPoliceStationId,
          message: message.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error ?? "Failed to send request");
        return;
      }
      setCriminalId("");
      setToPoliceStationId("");
      setMessage("");
      await load();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAccept(id: string) {
    if (!confirm("Accept this transfer? The criminal will move to your police station.")) {
      return;
    }
    const res = await fetch(`/api/transfers/${id}/accept`, { method: "POST" });
    const data = await res.json();
    if (!res.ok) alert(data.error ?? "Failed to accept");
    else await load();
  }

  async function handleReject(id: string) {
    if (!confirm("Reject this transfer request?")) return;
    const res = await fetch(`/api/transfers/${id}/reject`, { method: "POST" });
    const data = await res.json();
    if (!res.ok) alert(data.error ?? "Failed to reject");
    else await load();
  }

  async function handleCancel(id: string) {
    if (!confirm("Cancel this outgoing transfer request?")) return;
    const res = await fetch(`/api/transfers/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) alert(data.error ?? "Failed to cancel");
    else await load();
  }

  const outgoingPending = outgoing.filter((t) => t.status === "pending");
  const incomingPending = incoming.filter((t) => t.status === "pending");

  return (
    <section className="w-full space-y-6">
      <PageHeader
        title="Transfer Criminal"
        subtitle={`Request to move a record from ${session.policeStationName ?? "your PS"} to another police station. The receiving PS must accept.`}
      />

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <Card title="New transfer request" subtitle="Select a criminal under your PS and destination station">
        <form onSubmit={handleCreate} className="space-y-4">
          <section className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Criminal"
              value={criminalId}
              onChange={(e) => setCriminalId(e.target.value)}
              options={[
                { value: "", label: "Select criminal record" },
                ...criminals.map((c) => ({
                  value: c.id,
                  label: `${c.pid} — ${c.name}`,
                })),
              ]}
            />
            <Select
              label="Transfer to police station"
              value={toPoliceStationId}
              onChange={(e) => setToPoliceStationId(e.target.value)}
              disabled={stationsLoading}
              options={[
                {
                  value: "",
                  label: stationsLoading
                    ? "Loading stations…"
                    : targetStations.length === 0
                      ? "No other stations available"
                      : "Select destination PS",
                },
                ...targetStations.map((s) => ({
                  value: s.id,
                  label: s.name,
                })),
              ]}
            />
          </section>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-700">
              Note (optional)
            </span>
            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm"
              placeholder="Reason for transfer..."
            />
          </label>
          <Button type="submit" disabled={submitting || loading}>
            {submitting ? "Sending…" : "Send transfer request"}
          </Button>
        </form>
      </Card>

      <Card
        title="Incoming requests"
        subtitle={`${incomingPending.length} pending — accept to receive the criminal at ${session.policeStationName ?? "your PS"}`}
      >
        {loading ? (
          <p className="py-8 text-center text-sm text-[var(--color-muted)]">Loading…</p>
        ) : incoming.length === 0 ? (
          <p className="py-8 text-center text-sm text-[var(--color-muted)]">
            No incoming transfer requests.
          </p>
        ) : (
          <TransferTable
            rows={incoming}
            mode="incoming"
            onAccept={handleAccept}
            onReject={handleReject}
          />
        )}
      </Card>

      <Card
        title="Sent requests"
        subtitle={`${outgoingPending.length} pending — waiting for destination PS to accept`}
      >
        {loading ? (
          <p className="py-8 text-center text-sm text-[var(--color-muted)]">Loading…</p>
        ) : outgoing.length === 0 ? (
          <p className="py-8 text-center text-sm text-[var(--color-muted)]">
            No outgoing transfer requests.
          </p>
        ) : (
          <TransferTable
            rows={outgoing}
            mode="outgoing"
            onCancel={handleCancel}
          />
        )}
      </Card>
    </section>
  );
}

function TransferTable({
  rows,
  mode,
  onAccept,
  onReject,
  onCancel,
}: {
  rows: TransferRow[];
  mode: "incoming" | "outgoing";
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onCancel?: (id: string) => void;
}) {
  return (
    <DataTable>
      <DataTableHead>
        <DataTableHeaderCell>Criminal</DataTableHeaderCell>
        <DataTableHeaderCell>
          {mode === "incoming" ? "From PS" : "To PS"}
        </DataTableHeaderCell>
        <DataTableHeaderCell>Status</DataTableHeaderCell>
        <DataTableHeaderCell>Requested</DataTableHeaderCell>
        <DataTableHeaderCell className="w-[1%]">
          <span className="sr-only">Actions</span>
        </DataTableHeaderCell>
      </DataTableHead>
      <DataTableBody>
        {rows.map((row) => (
          <DataTableRow key={row.id}>
            <DataTableCell>
              <Link
                href={`/criminals/${row.criminalId}`}
                className="font-medium text-[var(--color-primary)] hover:underline"
              >
                {row.criminalPid}
              </Link>
              <p className="text-xs text-[var(--color-muted)]">{row.criminalName}</p>
              {row.message && (
                <p className="mt-1 text-xs text-slate-600">{row.message}</p>
              )}
            </DataTableCell>
            <DataTableCell>
              {mode === "incoming"
                ? row.fromPoliceStationName
                : row.toPoliceStationName}
              <p className="text-xs text-[var(--color-muted)]">
                by {row.requestedByName}
              </p>
            </DataTableCell>
            <DataTableCell>{statusBadge(row.status)}</DataTableCell>
            <DataTableCell className="text-xs text-slate-600">
              {formatWhen(row.createdAt)}
              {row.respondedAt && (
                <p className="mt-0.5">Done: {formatWhen(row.respondedAt)}</p>
              )}
            </DataTableCell>
            <DataTableCell>
              {row.status === "pending" && mode === "incoming" && (
                <ActionIcons>
                  <IconButton
                    label="Accept transfer"
                    variant="primary"
                    onClick={() => onAccept?.(row.id)}
                  >
                    <IconCheck />
                  </IconButton>
                  <IconButton
                    label="Reject transfer"
                    variant="danger"
                    onClick={() => onReject?.(row.id)}
                  >
                    <IconX />
                  </IconButton>
                </ActionIcons>
              )}
              {row.status === "pending" && mode === "outgoing" && (
                <IconButton
                  label="Cancel request"
                  variant="outline"
                  onClick={() => onCancel?.(row.id)}
                >
                  <IconTrash />
                </IconButton>
              )}
            </DataTableCell>
          </DataTableRow>
        ))}
      </DataTableBody>
    </DataTable>
  );
}
