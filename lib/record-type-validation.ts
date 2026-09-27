import type { Criminal } from "@/models/Criminal";
import { CriminalModel } from "@/models/Criminal";
import {
  isValidDagiVerificationFrequencyDays,
  normalizeDagiVerificationFrequencyDays,
  normalizeRecordType,
  type RecordType,
} from "@/lib/record-type";

export type RecordTypeValidation =
  | {
      ok: true;
      recordType: RecordType;
      pid: string;
      dagiNumber?: string;
      dagiVerificationFrequencyDays?: number;
    }
  | { ok: false; error: string; status: number };

/**
 * Every record is a Criminal → PID always required.
 * When marked Dagi → Dagi number + verification interval required.
 */
export async function validateRecordTypeIds(
  parsed: Pick<
    Criminal,
    | "pid"
    | "dagiNumber"
    | "recordType"
    | "name"
    | "dagiVerificationFrequencyDays"
  >,
  excludeId?: string
): Promise<RecordTypeValidation> {
  const recordType = normalizeRecordType(parsed.recordType);
  const name = String(parsed.name ?? "").trim();
  const pid = String(parsed.pid ?? "").trim();
  const dagiNumber = String(parsed.dagiNumber ?? "").trim() || undefined;

  if (!name) {
    return { ok: false, error: "Name is required", status: 400 };
  }

  if (!pid) {
    return {
      ok: false,
      error: "PID is required (every record is a Criminal)",
      status: 400,
    };
  }

  const existingPid = await CriminalModel.findByPid(pid);
  if (existingPid && existingPid._id?.toString() !== excludeId) {
    return {
      ok: false,
      error: "A record with this PID already exists",
      status: 409,
    };
  }

  if (recordType === "dagi") {
    if (!dagiNumber) {
      return {
        ok: false,
        error: "Dagi number is required when marked as Dagi",
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
    const days = Number(parsed.dagiVerificationFrequencyDays);
    if (!isValidDagiVerificationFrequencyDays(days)) {
      return {
        ok: false,
        error:
          "Dagi verification interval must be Monthly (मासिक), Quarterly (त्रैमासिक), or Yearly (वार्षिक)",
        status: 400,
      };
    }
    return {
      ok: true,
      recordType,
      pid,
      dagiNumber,
      dagiVerificationFrequencyDays: normalizeDagiVerificationFrequencyDays(days),
    };
  }

  return {
    ok: true,
    recordType: "criminal",
    pid,
    dagiNumber: undefined,
    dagiVerificationFrequencyDays: undefined,
  };
}

export function applyValidatedRecordIds<T extends Partial<Criminal>>(
  parsed: T,
  validated: Extract<RecordTypeValidation, { ok: true }>
): T {
  return {
    ...parsed,
    recordType: validated.recordType,
    pid: validated.pid,
    dagiNumber: validated.dagiNumber ?? "",
    dagiVerificationFrequencyDays:
      validated.dagiVerificationFrequencyDays ?? undefined,
  };
}
