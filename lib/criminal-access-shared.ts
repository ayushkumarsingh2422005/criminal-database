/** Client-safe helpers for criminal read vs write access by police station. */

export type CriminalPsRef = {
  permanentAddress?: { policeStationId?: string };
  presentAddress?: { policeStationId?: string };
  criminalHistory?: { casePoliceStationId?: string }[];
};

export function criminalBelongsToPoliceStationId(
  criminal: CriminalPsRef,
  policeStationId: string
): boolean {
  const id = policeStationId.trim();
  if (!id) return false;

  const matches = (value?: string) => value?.trim() === id;

  if (matches(criminal.permanentAddress?.policeStationId)) return true;
  if (matches(criminal.presentAddress?.policeStationId)) return true;

  for (const row of criminal.criminalHistory ?? []) {
    if (matches(row.casePoliceStationId)) return true;
  }

  return false;
}

/** Whether this user may create, edit, delete, verify, or upload for this record. */
export function canManageCriminalRecord(
  role: string,
  userPoliceStationId: string | undefined,
  criminal: CriminalPsRef
): boolean {
  if (role === "superadmin") return true;
  if (role === "admin" && userPoliceStationId) {
    return criminalBelongsToPoliceStationId(criminal, userPoliceStationId);
  }
  return false;
}
