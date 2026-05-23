"use client";

import { Badge } from "@/components/ui/Badge";
import type { VerificationStatus } from "@/lib/verification-shared";
import { VERIFICATION_STATUS_LABELS } from "@/lib/verification-shared";

export function VerificationStatusBadge({
  status,
  compact,
}: {
  status: VerificationStatus;
  compact?: boolean;
}) {
  const meta = VERIFICATION_STATUS_LABELS[status];
  const label = compact ? meta.en.split(" ")[0] : `${meta.en} / ${meta.hi}`;
  return <Badge variant={meta.variant}>{label}</Badge>;
}
