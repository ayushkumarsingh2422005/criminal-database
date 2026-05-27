"use client";

import { useEffect, useState } from "react";

export type InvestigationOfficerOption = {
  id: string;
  name: string;
  email: string;
  policeStationId?: string;
  policeStationName?: string;
  active: boolean;
};

export function useInvestigationOfficers(policeStationId?: string) {
  const [items, setItems] = useState<InvestigationOfficerOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!policeStationId) {
      setItems([]);
      return;
    }

    let cancelled = false;
    setLoading(true);
    const params = new URLSearchParams({ policeStationId });
    fetch(`/api/investigation-officers?${params}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setItems(Array.isArray(data) ? data.filter((io) => io.active) : []);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [policeStationId]);

  return { items, loading };
}
