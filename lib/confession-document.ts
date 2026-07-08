/** Resolve confession document path from current or legacy fields. */

export function resolveConfessionDocumentPath(criminal: {
  confessionDocument?: string;
  /** @deprecated Legacy text or path */
  confessionStatement?: string;
}): string | undefined {
  const current = criminal.confessionDocument?.trim();
  if (current) return current.startsWith("/") ? current : `/${current}`;

  const legacy = criminal.confessionStatement?.trim();
  if (!legacy) return undefined;
  if (legacy.includes("/criminals/") || legacy.startsWith("criminals/")) {
    return legacy.startsWith("/") ? legacy : `/${legacy}`;
  }
  return undefined;
}

export function confessionDocumentFileName(path?: string | null): string | null {
  if (!path?.trim()) return null;
  return path.trim().split("/").pop() ?? null;
}
