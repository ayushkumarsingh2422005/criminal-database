"use client";

import { useEffect, useState } from "react";

export interface LookupItem {
  id: string;
  name: string;
}

export function usePoliceStations(options?: { all?: boolean }) {
  const [items, setItems] = useState<LookupItem[]>([]);
  const [loading, setLoading] = useState(true);
  const all = options?.all === true;

  useEffect(() => {
    const url = all ? "/api/police-stations?all=1" : "/api/police-stations";
    fetch(url)
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [all]);

  return { items, loading };
}

/** All active stations except the logged-in admin's own (for transfer destination). */
export function useTransferPoliceStations() {
  const [items, setItems] = useState<LookupItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/police-stations?forTransfer=1")
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return { items, loading };
}

export function useCaseTypes() {
  const [items, setItems] = useState<LookupItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/case-types")
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return { items, loading };
}
