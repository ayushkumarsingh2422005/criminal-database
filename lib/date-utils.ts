/** Convert stored DOB to value for <input type="date"> (YYYY-MM-DD) */
export function toDateInputValue(value?: string): string {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  const dmy = value.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (dmy) {
    const [, d, m, y] = dmy;
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }

  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }
  return "";
}

/** Display DOB as DD.MM.YYYY for admin UI */
export function formatDateDisplay(value?: string): string {
  if (!value) return "";
  const iso = toDateInputValue(value);
  if (!iso) return value;
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}
