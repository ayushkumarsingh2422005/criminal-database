import type { CriminalRecord } from "@/lib/criminal-mapper";
import { enrichVerificationFields } from "@/lib/verification";

export async function enrichCriminalRecords(
  records: CriminalRecord[]
): Promise<CriminalRecord[]> {
  return Promise.all(
    records.map(async (record) => {
      const meta = await enrichVerificationFields(record.verificationHistory);
      return { ...record, ...meta };
    })
  );
}

export async function enrichCriminalRecord(
  record: CriminalRecord
): Promise<CriminalRecord> {
  const [enriched] = await enrichCriminalRecords([record]);
  return enriched!;
}
