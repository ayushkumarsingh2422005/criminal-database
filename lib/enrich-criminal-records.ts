import type { CriminalRecord } from "@/lib/criminal-mapper";
import { enrichAssignedIoNames } from "@/lib/enrich-io-names";
import { enrichVerificationFields } from "@/lib/verification";
import { isDagi } from "@/lib/record-type";
import {
  getNextVerificationDue,
  getVerificationStatus,
  sortVerificationHistory,
} from "@/lib/verification-shared";
import { DEFAULT_DAGI_VERIFICATION_FREQUENCY_DAYS } from "@/lib/record-type";

function enrichDagiVerification(record: CriminalRecord): CriminalRecord {
  if (!isDagi(record.recordType)) {
    return {
      ...record,
      dagiVerificationHistory: [],
      dagiVerificationStatus: undefined,
      dagiVerificationFrequencyDays: undefined,
      dagiLastVerifiedAt: undefined,
      dagiNextVerificationDue: undefined,
    };
  }

  const sorted = sortVerificationHistory(record.dagiVerificationHistory ?? []);
  const frequencyDays =
    record.dagiVerificationFrequencyDays &&
    record.dagiVerificationFrequencyDays > 0
      ? record.dagiVerificationFrequencyDays
      : DEFAULT_DAGI_VERIFICATION_FREQUENCY_DAYS;
  const last = sorted[0];

  return {
    ...record,
    dagiVerificationHistory: sorted,
    dagiVerificationFrequencyDays: frequencyDays,
    dagiVerificationStatus: getVerificationStatus(sorted, frequencyDays),
    dagiLastVerifiedAt: last?.verifiedAt,
    dagiNextVerificationDue: getNextVerificationDue(sorted, frequencyDays),
  };
}

export async function enrichCriminalRecords(
  records: CriminalRecord[]
): Promise<CriminalRecord[]> {
  const withVerification = await Promise.all(
    records.map(async (record) => {
      const meta = await enrichVerificationFields(record.verificationHistory);
      return enrichDagiVerification({ ...record, ...meta });
    })
  );
  return enrichAssignedIoNames(withVerification);
}

export async function enrichCriminalRecord(
  record: CriminalRecord
): Promise<CriminalRecord> {
  const [enriched] = await enrichCriminalRecords([record]);
  return enriched!;
}
