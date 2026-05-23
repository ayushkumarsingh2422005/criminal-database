import type { Criminal } from "@/models/Criminal";
import type { SessionPayload } from "@/lib/types";
import { isSuperAdmin } from "@/lib/admin-scope";
import { parseVerificationHistoryInput } from "@/lib/verification";

/** PS admins cannot alter verification history via general criminal save. */
export function applyVerificationWritePolicy(
  session: SessionPayload,
  existing: Criminal | null,
  parsed: Omit<Criminal, "_id">,
  rawBody?: Record<string, unknown>
): Omit<Criminal, "_id"> {
  if (isSuperAdmin(session) && rawBody && "verificationHistory" in rawBody) {
    return {
      ...parsed,
      verificationHistory: parseVerificationHistoryInput(rawBody.verificationHistory),
    };
  }

  const { verificationHistory: _h, verification: _legacy, ...rest } = parsed as Criminal;
  return {
    ...rest,
    verificationHistory: existing?.verificationHistory ?? [],
  };
}
