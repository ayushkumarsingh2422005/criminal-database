import type { CriminalRecord } from "@/lib/criminal-mapper";
import { enrichAssignedIoNames } from "@/lib/enrich-io-names";
import { enrichVerificationFields } from "@/lib/verification";

export async function enrichCriminalRecords(
  records: CriminalRecord[]
): Promise<CriminalRecord[]> {
  const withVerification = await Promise.all(
    records.map(async (record) => {
      const meta = await enrichVerificationFields(record.verificationHistory);
      return { ...record, ...meta };
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
