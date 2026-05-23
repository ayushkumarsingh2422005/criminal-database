import type { VerificationRecord } from "@/models/Criminal";
import type { VerificationStatus } from "@/lib/verification-shared";

export type CriminalVerificationMeta = {
  verificationHistory: VerificationRecord[];
  verificationStatus?: VerificationStatus;
  verificationFrequencyDays?: number;
  lastVerifiedAt?: string;
  nextVerificationDue?: string;
};
