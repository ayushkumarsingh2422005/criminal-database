import type { Criminal, VerificationInfo, VerificationRecord } from "@/models/Criminal";
import { CriminalModel, getCriminalCollection } from "@/models/Criminal";
import {
  DEFAULT_VERIFICATION_SEED_DATE,
  sortVerificationHistory,
} from "@/lib/verification";

type LegacyCriminal = Criminal & {
  verification?: VerificationInfo;
};

function legacyToRecord(
  verification?: VerificationInfo
): VerificationRecord | null {
  if (!verification?.verificationDate?.trim()) return null;
  const date = verification.verificationDate.trim();
  const iso = date.includes("T") ? date : `${date}T00:00:00.000Z`;
  return {
    verifiedAt: iso,
    officerName: verification.verifyingOfficer?.trim() || "Unknown Officer",
  };
}

function buildDefaultHistory(c: LegacyCriminal): VerificationRecord[] {
  const fromLegacy = legacyToRecord(c.verification);
  if (fromLegacy) return sortVerificationHistory([fromLegacy]);
  return [
    {
      verifiedAt: DEFAULT_VERIFICATION_SEED_DATE,
      officerName: "System (initial seed)",
    },
  ];
}

export async function migrateVerificationHistory(): Promise<{ updated: number }> {
  const criminals = await CriminalModel.findMany({}, { limit: 50_000 });
  const col = await getCriminalCollection();
  let updated = 0;

  for (const raw of criminals) {
    const c = raw as LegacyCriminal;
    const existing = c.verificationHistory ?? [];
    const needsHistory = existing.length === 0;
    const hasLegacy = Boolean(c.verification?.verificationDate?.trim());
    if (!needsHistory && !hasLegacy) continue;

    let history = existing.length > 0 ? sortVerificationHistory(existing) : buildDefaultHistory(c);
    if (hasLegacy && existing.length === 0) {
      const legacy = legacyToRecord(c.verification);
      if (legacy) history = sortVerificationHistory([legacy, ...history]);
    }

    await col.updateOne(
      { _id: c._id },
      {
        $set: {
          verificationHistory: history,
          updatedAt: new Date(),
        },
        $unset: { verification: "" },
      }
    );
    updated++;
  }

  return { updated };
}
