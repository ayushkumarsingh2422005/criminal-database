import { toDateInputValue } from "@/lib/date-utils";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export function formatFirDate(value?: string): string {
  const iso = toDateInputValue(value);
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  const mon = MONTHS[parseInt(m, 10) - 1] ?? m;
  return `${d}-${mon}-${y}`;
}

export function formatDobDots(value?: string): string {
  const iso = toDateInputValue(value);
  if (!iso) return value ?? "";
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

export function formatAddressInline(addr?: {
  line?: string;
  thana?: string;
  district?: string;
}): string {
  if (!addr?.line && !addr?.thana && !addr?.district) return "";
  return [addr.line, addr.thana && `थाना-${addr.thana}`, addr.district]
    .filter(Boolean)
    .join(", ");
}

export function dash(value?: string | null): string {
  return value?.trim() ? value.trim() : "—";
}
