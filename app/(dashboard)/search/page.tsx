"use client";

import { FormEvent, useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { IconChevronLeft, IconChevronRight } from "@/components/ui/icons";
import { SectionTitle } from "@/components/ui/FieldLabel";
import { CriminalTable } from "@/components/criminals/CriminalTable";
import { PageHeader } from "@/components/layout/PageHeader";
import { fieldLabel } from "@/lib/criminal-fields";
import { EXTENDED_FIELDS, extLabel } from "@/lib/criminal-extended-fields";
import {
  emptySearchFilters,
  filtersToSearchParams,
  type CriminalSearchFilters,
} from "@/lib/criminal-search-filters";
import { districtSelectOptions } from "@/lib/jharkhand-districts";
import { useCaseTypes, usePoliceStations } from "@/lib/hooks/use-lookups";
import { useAppSession } from "@/components/session/SessionProvider";
import type { CriminalRecord } from "@/lib/criminal-mapper";

export default function SearchPage() {
  const session = useAppSession();
  const isScopedAdmin = session.role === "admin" && !!session.policeStationId;
  const isIo = session.role === "io";

  const [filters, setFilters] = useState<CriminalSearchFilters>(emptySearchFilters);
  const [items, setItems] = useState<CriminalRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const { items: caseTypes } = useCaseTypes();
  const { items: policeStations } = usePoliceStations();
  const districtOptions = districtSelectOptions("All districts / सभी जिले");

  const set =
    (key: keyof CriminalSearchFilters) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setFilters((f) => ({ ...f, [key]: e.target.value }));

  async function fetchResults(
    p = 1,
    activeFilters = filters,
    activeLimit = limit
  ) {
    setLoading(true);
    const params = filtersToSearchParams(activeFilters, p, activeLimit);
    const res = await fetch(`/api/criminals?${params}`);
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setItems(data.items);
      setTotalPages(data.totalPages);
      setPage(data.page);
    }
  }

  useEffect(() => {
    fetchResults(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    fetchResults(1);
  }

  function handleReset() {
    const cleared = emptySearchFilters();
    setFilters(cleared);
    setPage(1);
    fetchResults(1, cleared);
  }

  return (
    <section className="w-full space-y-6">
      <PageHeader
        title="Search Criminals"
        subtitle={
          isIo
            ? "Assigned criminals only — view, upload photos, and verify."
            : isScopedAdmin
            ? `Records for your police station only: ${session.policeStationName ?? "assigned PS"}`
            : "अपराधी खोज — filter by personal details, criminal history, vehicles, associates, and more."
        }
      />

      <Card title="Search Filters" subtitle="खोज फ़िल्टर">
        <form onSubmit={handleSearch} className="space-y-8">
          <section className="space-y-4">
            <SectionTitle en="Personal & Address" hi="व्यक्तिगत व पता" />
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Input
                label={fieldLabel("pid")}
                value={filters.pid}
                onChange={set("pid")}
                placeholder="269517"
              />
              <Input
                label={fieldLabel("name")}
                value={filters.name}
                onChange={set("name")}
              />
              <Input
                label={fieldLabel("mobileNumber")}
                value={filters.mobileNumber}
                onChange={set("mobileNumber")}
              />
              <Input
                label={fieldLabel("fatherName")}
                value={filters.fatherName}
                onChange={set("fatherName")}
              />
              <Input
                label={fieldLabel("aadhaarNumber")}
                value={filters.aadhaarNumber}
                onChange={set("aadhaarNumber")}
              />
              {!isScopedAdmin && (
                <>
                  <Select
                    label={fieldLabel("addressPoliceStation")}
                    value={filters.addressPoliceStation}
                    onChange={set("addressPoliceStation")}
                    options={[
                      { value: "", label: "All police stations / सभी थाना" },
                      ...policeStations.map((s) => ({ value: s.id, label: s.name })),
                    ]}
                  />
                  <Select
                    label={fieldLabel("addressType")}
                    value={filters.addressType}
                    onChange={set("addressType")}
                    options={[
                      { value: "any", label: "Permanent or present / स्थायी या वर्तमान" },
                      { value: "permanent", label: "Permanent address only / केवल स्थायी पता" },
                      { value: "present", label: "Present address only / केवल वर्तमान पता" },
                    ]}
                  />
                </>
              )}
              <Select
                label={fieldLabel("district")}
                value={filters.district}
                onChange={set("district")}
                options={districtOptions}
              />
            </section>
          </section>

          <section className="space-y-4">
            <SectionTitle
              en={EXTENDED_FIELDS.criminalHistory.en}
              hi={EXTENDED_FIELDS.criminalHistory.hi}
            />
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Select
                label={extLabel("crimeType")}
                value={filters.historyCrimeType}
                onChange={set("historyCrimeType")}
                options={[
                  { value: "all", label: "All / सभी" },
                  ...caseTypes.map((c) => ({ value: c.name, label: c.name })),
                ]}
              />
              <Input
                label={extLabel("year")}
                value={filters.historyYear}
                onChange={set("historyYear")}
                placeholder="2024"
              />
              <Input
                label={extLabel("sectionAct")}
                value={filters.sectionAct}
                onChange={set("sectionAct")}
                placeholder="379 IPC"
              />
              {!isScopedAdmin && (
                <Select
                  label={extLabel("casePoliceStation")}
                  value={filters.historyCasePS}
                  onChange={set("historyCasePS")}
                  options={[
                    { value: "", label: "All / सभी" },
                    ...policeStations.map((s) => ({ value: s.id, label: s.name })),
                  ]}
                />
              )}
            </section>
          </section>

          <section className="space-y-4">
            <SectionTitle en="Vehicle & Physical" hi="वाहन व शारीरिक" />
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Input
                label={extLabel("vehicleNumber")}
                value={filters.vehicleNumber}
                onChange={set("vehicleNumber")}
                placeholder="JH01CT1105"
              />
              <Input
                label={extLabel("identificationMarks")}
                value={filters.identificationMarks}
                onChange={set("identificationMarks")}
                placeholder="mole, scar, tattoo"
              />
            </section>
          </section>

          <section className="space-y-4">
            <SectionTitle
              en="Relatives, Gang & Bailers"
              hi="संबंधी, गुट व बेलर"
            />
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Input
                label="Associate Name / संबंधी-गुट नाम"
                value={filters.associateName}
                onChange={set("associateName")}
              />
              <Input
                label="Associate Mobile / संबंधी मोबाइल"
                value={filters.associateMobile}
                onChange={set("associateMobile")}
              />
              <Input
                label="Associate Aadhaar / संबंधी आधार"
                value={filters.associateAadhaar}
                onChange={set("associateAadhaar")}
              />
              <Input
                label="Bailer Name / बेलर नाम"
                value={filters.bailerName}
                onChange={set("bailerName")}
              />
            </section>
          </section>

          <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--color-border)] pt-4">
            <label className="flex items-center gap-2 text-sm text-slate-600">
              Showing
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="rounded border border-[var(--color-border)] px-2 py-1"
              >
                {[10, 25, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              per page
            </label>
            <section className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleReset}>
                Reset
              </Button>
              <Button type="submit">Search</Button>
            </section>
          </footer>
        </form>
      </Card>

      <Card title="Search Results" subtitle={`Page ${page} of ${totalPages || 1}`}>
        <CriminalTable items={items} loading={loading} linkToDetail />
        {totalPages > 1 && (
          <footer className="mt-4 flex justify-center gap-1">
            <IconButton
              label="Previous page"
              variant="outline"
              disabled={page <= 1}
              onClick={() => fetchResults(page - 1)}
            >
              <IconChevronLeft />
            </IconButton>
            <span className="flex items-center px-2 text-sm text-[var(--color-muted)]">
              {page} / {totalPages}
            </span>
            <IconButton
              label="Next page"
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => fetchResults(page + 1)}
            >
              <IconChevronRight />
            </IconButton>
          </footer>
        )}
      </Card>
    </section>
  );
}
