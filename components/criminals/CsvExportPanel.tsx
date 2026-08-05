"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { SectionTitle } from "@/components/ui/FieldLabel";
import {
  CSV_EXPORT_MAX_ROWS,
  defaultExportGroups,
  getAvailableExportGroups,
  type CsvExportGroup,
} from "@/lib/criminal-csv-export";
import {
  filtersToExportParams,
  type CriminalSearchFilters,
} from "@/lib/criminal-search-filters";
import { useAppSession } from "@/components/session/SessionProvider";
import { resolveDistrictForSave } from "@/lib/jharkhand-districts";

export function CsvExportPanel({
  filters,
  districtSelect = "",
  districtCustom = "",
  resultCount,
}: {
  filters: CriminalSearchFilters;
  districtSelect?: string;
  districtCustom?: string;
  /** Total matching records from last search (optional hint). */
  resultCount?: number;
}) {
  const session = useAppSession();
  const availableGroups = useMemo(
    () => getAvailableExportGroups(session.role),
    [session.role]
  );
  const [selected, setSelected] = useState<Set<CsvExportGroup>>(
    () => new Set(defaultExportGroups(session.role))
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function toggleGroup(id: CsvExportGroup) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAll() {
    setSelected(new Set(availableGroups.map((g) => g.id)));
  }

  function selectNone() {
    setSelected(new Set());
  }

  async function handleDownload() {
    if (!selected.size) {
      setError("Select at least one data section to export.");
      return;
    }

    setLoading(true);
    setError("");

    const district = resolveDistrictForSave(districtSelect, districtCustom);
    const exportFilters = { ...filters, district };
    const params = filtersToExportParams(exportFilters, [...selected]);

    try {
      const res = await fetch(`/api/criminals/export?${params}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Export failed");
      }

      const blob = await res.blob();
      const disposition = res.headers.get("Content-Disposition") ?? "";
      const match = disposition.match(/filename="([^"]+)"/);
      const filename = match?.[1] ?? `criminals-export-${new Date().toISOString().slice(0, 10)}.csv`;

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-4 rounded-lg border border-[var(--color-border)] bg-slate-50/80 p-4">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <section>
          <SectionTitle en="Export to CSV" hi="CSV में निर्यात" />
          <p className="mt-1 text-sm text-slate-600">
            Downloads records matching your current search filters (up to{" "}
            {CSV_EXPORT_MAX_ROWS.toLocaleString()} rows).
            {resultCount != null ? ` Current search: ${resultCount} record(s).` : null}
          </p>
        </section>
        <section className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={selectAll}>
            Select all
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={selectNone}>
            Clear
          </Button>
          <Button type="button" size="sm" disabled={loading} onClick={handleDownload}>
            {loading ? "Preparing…" : "Download CSV"}
          </Button>
        </section>
      </header>

      <section className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {availableGroups.map((group) => (
          <label
            key={group.id}
            className="flex cursor-pointer items-start gap-2 rounded-md border border-transparent bg-white px-3 py-2 text-sm shadow-sm hover:border-slate-200"
          >
            <input
              type="checkbox"
              className="mt-0.5"
              checked={selected.has(group.id)}
              onChange={() => toggleGroup(group.id)}
            />
            <span>
              <span className="font-medium text-slate-800">{group.labelEn}</span>
              <span className="block text-xs text-slate-500">{group.labelHi}</span>
            </span>
          </label>
        ))}
      </section>

      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}
