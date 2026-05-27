"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CriminalDetailView } from "@/components/criminals/CriminalDetailView";
import { useAppSession } from "@/components/session/SessionProvider";
import type { CriminalRecord } from "@/lib/criminal-mapper";

export default function CriminalDetailPage() {
  const session = useAppSession();
  const params = useParams();
  const id = params.id as string;
  const [criminal, setCriminal] = useState<CriminalRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/criminals/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          setCriminal(null);
        } else {
          setCriminal(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load record");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <p className="py-12 text-center text-sm text-[var(--color-muted)]">
        Loading criminal record...
      </p>
    );
  }

  if (error || !criminal) {
    return (
      <section className="space-y-4">
        <p className="text-red-600">{error || "Record not found"}</p>
        <Link href="/search" className="text-sm text-[var(--color-primary)] hover:underline">
          ← Back to Search
        </Link>
      </section>
    );
  }

  return <CriminalDetailView criminal={criminal} ioMode={session.role === "io"} />;
}
