"use client";

import { Badge } from "@/components/ui/Badge";
import { criminalStatusMeta } from "@/lib/criminal-status";

export function CriminalStatusBadge({
  status,
  compact,
}: {
  status?: string | null;
  compact?: boolean;
}) {
  const meta = criminalStatusMeta(status);
  const label = compact ? meta.en : `${meta.en} / ${meta.hi}`;
  return <Badge variant={meta.variant}>{label}</Badge>;
}
