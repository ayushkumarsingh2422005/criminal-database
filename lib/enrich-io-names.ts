import "server-only";

import { AdminModel } from "@/models/Admin";
import type { CriminalRecord } from "@/lib/criminal-mapper";

export async function enrichAssignedIoNames(
  records: CriminalRecord[]
): Promise<CriminalRecord[]> {
  const ids = [...new Set(records.map((r) => r.assignedIoId).filter(Boolean))] as string[];
  if (ids.length === 0) return records;

  const nameById = new Map<string, string>();
  await Promise.all(
    ids.map(async (id) => {
      const io = await AdminModel.findById(id);
      if (io?.role === "io") nameById.set(id, io.name);
    })
  );

  return records.map((r) =>
    r.assignedIoId && nameById.has(r.assignedIoId)
      ? { ...r, assignedIoName: nameById.get(r.assignedIoId) }
      : r
  );
}
