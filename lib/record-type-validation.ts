import type { Criminal } from "@/models/Criminal";
import { CriminalModel } from "@/models/Criminal";
import { normalizeRecordType, type RecordType } from "@/lib/record-type";

export type RecordTypeValidation =
  | { ok: true; recordType: RecordType; pid: string; dagiNumber?: string }
  | { ok: false; error: string; status: number };

/**
 * Validates PID / Dagi number rules and uniqueness.
 * `excludeId` skips the current document on update.
 */
export async function validateRecordTypeIds(
  parsed: Pick<Criminal, "pid" | "dagiNumber" | "recordType" | "name">,
  excludeId?: string
): Promise<RecordTypeValidation> {
  const recordType = normalizeRecordType(parsed.recordType);
  const name = String(parsed.name ?? "").trim();
  const pid = String(parsed.pid ?? "").trim();
  const dagiNumber = String(parsed.dagiNumber ?? "").trim() || undefined;

  if (!name) {
    return { ok: false, error: "Name is required", status: 400 };
  }

  if (recordType === "criminal") {
    if (!pid) {
      return { ok: false, error: "PID is required for Criminal records", status: 400 };
    }
    const existing = await CriminalModel.findByPid(pid);
    if (existing && existing._id?.toString() !== excludeId) {
      return {
        ok: false,
        error: "A record with this PID already exists",
        status: 409,
      };
    }
    return { ok: true, recordType, pid, dagiNumber: undefined };
  }

  if (!dagiNumber) {
    return {
      ok: false,
      error: "Dagi number is required for Dagi records",
      status: 400,
    };
  }
  const existingDagi = await CriminalModel.findByDagiNumber(dagiNumber);
  if (existingDagi && existingDagi._id?.toString() !== excludeId) {
    return {
      ok: false,
      error: "A record with this Dagi number already exists",
      status: 409,
    };
  }
  // Keep pid empty for dagi so it never collides with criminal PIDs
  return { ok: true, recordType, pid: "", dagiNumber };
}

/** Apply validated IDs onto a parsed body (clears the unused ID field). */
export function applyValidatedRecordIds<T extends Partial<Criminal>>(
  parsed: T,
  validated: Extract<RecordTypeValidation, { ok: true }>
): T {
  return {
    ...parsed,
    recordType: validated.recordType,
    pid: validated.pid,
    dagiNumber: validated.dagiNumber ?? "",
  };
}
