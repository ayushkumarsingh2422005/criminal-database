import "server-only";

import type { VerificationRecord } from "@/models/Criminal";
import { AppSettingsModel } from "@/models/AppSettings";
import {
  DEFAULT_VERIFICATION_FREQUENCY_DAYS,
  getNextVerificationDue,
  getVerificationStatus,
  sortVerificationHistory,
  type VerificationEnrichment,
} from "@/lib/verification-shared";

export type { VerificationStatus, VerificationEnrichment } from "@/lib/verification-shared";
export {
  DEFAULT_VERIFICATION_SEED_DATE,
  DEFAULT_VERIFICATION_FREQUENCY_DAYS,
  getLastVerification,
  getNextVerificationDue,
  getVerificationStatus,
  parseVerificationHistoryInput,
  parseVerifiedAtFromClient,
  sortVerificationHistory,
  VERIFICATION_STATUS_LABELS,
} from "@/lib/verification-shared";

export async function getVerificationFrequencyDays(): Promise<number> {
  const settings = await AppSettingsModel.get();
  const days = settings.verificationFrequencyDays;
  return Number.isFinite(days) && days > 0 ? days : DEFAULT_VERIFICATION_FREQUENCY_DAYS;
}

export async function enrichVerificationFields(
  history: VerificationRecord[] | undefined
): Promise<VerificationEnrichment> {
  const sorted = sortVerificationHistory(history ?? []);
  const frequencyDays = await getVerificationFrequencyDays();
  const last = sorted[0];
  return {
    verificationHistory: sorted,
    verificationStatus: getVerificationStatus(sorted, frequencyDays),
    verificationFrequencyDays: frequencyDays,
    lastVerifiedAt: last?.verifiedAt,
    nextVerificationDue: getNextVerificationDue(sorted, frequencyDays),
  };
}
