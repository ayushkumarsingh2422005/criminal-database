import { ObjectId } from "mongodb";
import type { Criminal, CriminalHistoryEntry } from "@/models/Criminal";
import { CriminalModel, getCriminalCollection } from "@/models/Criminal";
import { PoliceStationModel } from "@/models/PoliceStation";
import { extractYearFromDate } from "@/lib/criminal-history-utils";

type LegacyHistoryRow = CriminalHistoryEntry & {
  policeStationId?: ObjectId;
  policeStation?: string;
  caseNumber?: string;
  firNumber?: string;
  judgeName?: string;
  court?: string;
  crimeType?: string;
  year?: string;
  casePoliceStationId?: ObjectId;
};

type LegacyCriminal = Criminal & {
  crimeTypes?: string[];
  criminalHistory?: LegacyHistoryRow[];
};

function normalizeHistoryRow(
  row: LegacyHistoryRow,
  index: number,
  legacyTypes: string[]
): CriminalHistoryEntry {
  const psId = row.casePoliceStationId ?? row.policeStationId;
  const year =
    row.year?.trim() ||
    extractYearFromDate(row.firDate) ||
    undefined;
  const crimeType =
    row.crimeType?.trim() ||
    legacyTypes[index] ||
    legacyTypes[0] ||
    undefined;

  return {
    sNo: row.sNo ?? index + 1,
    ...(year ? { year } : {}),
    ...(crimeType ? { crimeType } : {}),
    ...(psId ? { casePoliceStationId: psId } : {}),
    ...(row.firDate?.trim() ? { firDate: row.firDate.trim() } : {}),
    ...(row.sectionAct?.trim() ? { sectionAct: row.sectionAct.trim() } : {}),
  };
}

async function resolveLegacyCasePs(
  row: LegacyHistoryRow,
  nameToId: Map<string, string>
): Promise<ObjectId | undefined> {
  if (row.casePoliceStationId) return row.casePoliceStationId;
  if (row.policeStationId) return row.policeStationId;
  const legacy = row.policeStation?.trim();
  if (!legacy) return undefined;
  const id = nameToId.get(legacy.toLowerCase());
  return id ? new ObjectId(id) : undefined;
}

export async function migrateCriminalHistorySchema(): Promise<{
  updated: number;
  historyRows: number;
}> {
  const nameToId = await PoliceStationModel.findAllNameToIdMap();
  const criminals = await CriminalModel.findMany({}, { limit: 50_000 });
  const col = await getCriminalCollection();
  let updated = 0;
  let historyRows = 0;

  for (const raw of criminals) {
    const c = raw as LegacyCriminal;
    const legacyTypes = c.crimeTypes ?? [];
    const sourceHistory = c.criminalHistory ?? [];

    let newHistory: CriminalHistoryEntry[] = [];

    if (sourceHistory.length > 0) {
      for (let i = 0; i < sourceHistory.length; i++) {
        const row = { ...sourceHistory[i] } as LegacyHistoryRow;
        const psId = await resolveLegacyCasePs(row, nameToId);
        if (psId) row.casePoliceStationId = psId;
        newHistory.push(normalizeHistoryRow(row, i, legacyTypes));
      }
    } else if (legacyTypes.length > 0) {
      newHistory = legacyTypes.map((crimeType, i) => ({
        sNo: i + 1,
        crimeType,
      }));
    }

    historyRows += newHistory.length;

    const needsUpdate =
      legacyTypes.length > 0 ||
      sourceHistory.some(
        (row) =>
          (row as LegacyHistoryRow).caseNumber ||
          (row as LegacyHistoryRow).firNumber ||
          (row as LegacyHistoryRow).judgeName ||
          (row as LegacyHistoryRow).court ||
          (row as LegacyHistoryRow).policeStationId ||
          (row as LegacyHistoryRow).policeStation
      ) ||
      sourceHistory.some((row) => !(row as LegacyHistoryRow).crimeType);

    if (!needsUpdate && newHistory.length === sourceHistory.length) {
      continue;
    }

    await col.updateOne(
      { _id: c._id },
      {
        $set: {
          criminalHistory: newHistory,
          updatedAt: new Date(),
        },
        $unset: { crimeTypes: "" },
      }
    );
    updated++;
  }

  return { updated, historyRows };
}
