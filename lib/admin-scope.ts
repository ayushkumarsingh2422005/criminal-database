import { DEFAULT_STATE } from "@/lib/indian-states";
import "server-only";

import { ObjectId, type Filter } from "mongodb";
import type { Criminal, CriminalAddress, CriminalHistoryEntry } from "@/models/Criminal";
import { AdminModel } from "@/models/Admin";
import { AuthError, isIo } from "@/lib/auth";
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

export function buildIoAssignmentFilter(ioId: string | ObjectId): Filter<Criminal> {
  const oid = typeof ioId === "string" ? new ObjectId(ioId) : ioId;
  return { assignedIoId: oid };
}

export async function buildSessionCriminalScopeFilter(
  session: SessionPayload
): Promise<Filter<Criminal>> {
  if (isIo(session)) {
    const psId = await getScopedPoliceStationId(session);
    const ioFilter = buildIoAssignmentFilter(session.sub);
    if (!psId) return ioFilter;
    return mergeCriminalFilters(ioFilter, buildPoliceStationScopeFilter(psId));
  }

  // Superadmin and PS admin: no list filter — all criminals visible (write still scoped).
  return {};
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

export function criminalAssignedToIo(criminal: Criminal, ioId: string): boolean {
  return criminal.assignedIoId?.toString() === ioId;
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

  if (isIo(session)) {
    if (!criminalAssignedToIo(criminal, session.sub)) {
      throw new AuthError("This criminal is not assigned to you", 403);
    }
    const psId = await getScopedPoliceStationId(session);
    if (psId && !criminalBelongsToPoliceStation(criminal, psId)) {
      throw new AuthError("You do not have access to this record", 403);
    }
    return;
  }

  // Superadmin and PS admin may view any criminal record.
}

/** IO: assigned criminals only. Admins: modify only records under their PS (superadmin: any). */
export async function assertCriminalMutateAccess(
  session: SessionPayload,
  criminal: Criminal | null
): Promise<void> {
  if (isIo(session)) {
    await assertCriminalAccess(session, criminal);
    return;
  }
  await assertCriminalWriteAccess(session, criminal);
}

/** Edit, delete, verify, upload — only for records under the admin's PS (or any for superadmin). */
export async function assertCriminalWriteAccess(
  session: SessionPayload,
  criminal: Criminal | null
): Promise<void> {
  if (!criminal) {
    throw new AuthError("Not found", 404);
  }

  if (isIo(session)) {
    throw new AuthError(
      "Investigation officers have read-only access to criminal records",
      403
    );
  }

  const psId = await getScopedPoliceStationId(session);
  if (!psId) return;

  if (!criminalBelongsToPoliceStation(criminal, psId)) {
    throw new AuthError(
      "You can only modify records for your police station. View-only access for other stations.",
      403
    );
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
    state: addr?.state ?? DEFAULT_STATE,
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
