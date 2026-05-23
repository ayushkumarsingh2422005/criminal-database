import type { Criminal, CriminalAddress } from "@/models/Criminal";
import { CriminalModel, getCriminalCollection } from "@/models/Criminal";
import { DEFAULT_STATE } from "@/lib/indian-states";

function withDefaultState(addr?: CriminalAddress): CriminalAddress | undefined {
  if (!addr) return undefined;
  if (addr.state?.trim()) return addr;
  return { ...addr, state: DEFAULT_STATE };
}

/** Set state to Jharkhand on existing addresses that have no state. */
export async function migrateAddressStateField(): Promise<{ updated: number }> {
  const criminals = await CriminalModel.findMany({}, { limit: 50_000 });
  const col = await getCriminalCollection();
  let updated = 0;

  for (const c of criminals) {
    const permanent = withDefaultState(c.permanentAddress);
    const present = withDefaultState(c.presentAddress);
    const needsPermanent = permanent !== c.permanentAddress;
    const needsPresent = present !== c.presentAddress;
    if (!needsPermanent && !needsPresent) continue;

    const patch: Partial<Criminal> = {};
    if (needsPermanent && permanent) patch.permanentAddress = permanent;
    if (needsPresent && present) patch.presentAddress = present;

    if (c._id) {
      await col.updateOne(
        { _id: c._id },
        { $set: { ...patch, updatedAt: new Date() } }
      );
      updated++;
    }
  }

  return { updated };
}
