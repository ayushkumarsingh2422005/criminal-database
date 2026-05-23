import "server-only";

import { ObjectId, type Filter } from "mongodb";
import type { Criminal, CriminalAddress, CriminalHistoryEntry } from "@/models/Criminal";
import { AdminModel } from "@/models/Admin";
import { AuthError } from "@/lib/auth";
import type { SessionPayload } from "@/lib/types";

export function isSuperAdmin(session: SessionPayload): boolean {
  return session.role === "superadmin";
}

export async function getScopedPoliceStationId(
  session: SessionPayload
): Promise<ObjectId | null> {
  if (isSuperAdmin(session)) return null;

  if (session.policeStationId && ObjectId.isValid(session.policeStationId)) {
    return new ObjectId(session.policeStationId);
  }

  const admin = await AdminModel.findById(session.sub);
  if (!admin?.policeStationId) {
    throw new AuthError(
      "Your account is not assigned to a police station. Contact superadmin.",
      403
    );
  }
  return admin.policeStationId;
}

export function criminalBelongsToPoliceStation(
  criminal: Criminal,
  policeStationId: ObjectId
): boolean {
  const id = policeStationId.toString();
  const matches = (value?: ObjectId) => value?.toString() === id;

  if (matches(criminal.permanentAddress?.policeStationId)) return true;
  if (matches(criminal.presentAddress?.policeStationId)) return true;

  for (const row of criminal.criminalHistory ?? []) {
    if (matches(row.casePoliceStationId)) return true;
    const legacy = row as { policeStationId?: ObjectId };
    if (matches(legacy.policeStationId)) return true;
  }

  return false;
}

export function buildPoliceStationScopeFilter(
  policeStationId: ObjectId
): Filter<Criminal> {
  return {
    $or: [
      { "permanentAddress.policeStationId": policeStationId },
      { "presentAddress.policeStationId": policeStationId },
      { "criminalHistory.casePoliceStationId": policeStationId },
      { "criminalHistory.policeStationId": policeStationId },
    ],
  };
}

export function mergeCriminalFilters(
  base: Filter<Criminal>,
  extra: Filter<Criminal>
): Filter<Criminal> {
  const baseEmpty = Object.keys(base).length === 0;
  const extraEmpty = Object.keys(extra).length === 0;
  if (baseEmpty) return extra;
  if (extraEmpty) return base;
  return { $and: [base, extra] };
}

export async function assertCriminalAccess(
  session: SessionPayload,
  criminal: Criminal | null
): Promise<void> {
  if (!criminal) {
    throw new AuthError("Not found", 404);
  }

  const psId = await getScopedPoliceStationId(session);
  if (!psId) return;

  if (!criminalBelongsToPoliceStation(criminal, psId)) {
    throw new AuthError("You do not have access to this record", 403);
  }
}

function withPoliceStation(
  addr: CriminalAddress | undefined,
  psId: ObjectId
): CriminalAddress {
  const line = addr?.line?.trim() || "—";
  return {
    line,
    policeStationId: psId,
    ...(addr?.district ? { district: addr.district } : {}),
  };
}

/** Force saved criminal data to the admin's allotted police station. */
export function applyScopedAdminWrite(
  parsed: Omit<Criminal, "_id">,
  policeStationId: ObjectId
): Omit<Criminal, "_id"> {
  const history: CriminalHistoryEntry[] = (parsed.criminalHistory ?? []).map(
    (row) => ({
      ...row,
      casePoliceStationId: policeStationId,
    })
  );

  return {
    ...parsed,
    permanentAddress: withPoliceStation(parsed.permanentAddress, policeStationId),
    presentAddress: withPoliceStation(parsed.presentAddress, policeStationId),
    criminalHistory: history,
  };
}

export async function applySessionWriteScope(
  session: SessionPayload,
  parsed: Omit<Criminal, "_id">
): Promise<Omit<Criminal, "_id">> {
  const psId = await getScopedPoliceStationId(session);
  if (!psId) return parsed;
  return applyScopedAdminWrite(parsed, psId);
}
