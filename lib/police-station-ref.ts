import { ObjectId } from "mongodb";
import { resolveAddressState } from "@/lib/indian-states";
import type { Criminal, CriminalAddress, CriminalHistoryEntry } from "@/models/Criminal";
import { PoliceStationModel } from "@/models/PoliceStation";
import { CriminalModel } from "@/models/Criminal";
import type { CriminalHistoryRecord, CriminalRecord } from "@/lib/criminal-mapper";

export type PoliceStationNameMap = Map<string, string>;

export function parsePoliceStationId(value: unknown): ObjectId | undefined {
  if (value == null || value === "") return undefined;
  const id = String(value).trim();
  if (!ObjectId.isValid(id)) return undefined;
  return new ObjectId(id);
}

export async function requirePoliceStationId(
  value: unknown,
  fieldLabel: string
): Promise<ObjectId | undefined> {
  const id = parsePoliceStationId(value);
  if (!id) return undefined;
  const station = await PoliceStationModel.findById(id.toString());
  if (!station) {
    throw new Error(`Invalid police station for ${fieldLabel}`);
  }
  return id;
}

function legacyThana(addr?: CriminalAddress & { thana?: string }): string | undefined {
  const legacy = addr as { thana?: string } | undefined;
  return legacy?.thana?.trim() || undefined;
}

export async function resolvePoliceStationIdFromLegacy(
  policeStationId: ObjectId | undefined,
  legacyName: string | undefined
): Promise<ObjectId | undefined> {
  if (policeStationId) return policeStationId;
  if (!legacyName?.trim()) return undefined;
  const station = await PoliceStationModel.findByNameInsensitive(legacyName.trim());
  return station?._id;
}

export async function parseAddressInput(
  raw: unknown,
  fieldLabel: string
): Promise<CriminalAddress | undefined> {
  if (!raw || typeof raw !== "object") return undefined;
  const o = raw as Record<string, unknown>;
  const line = String(o.line ?? "").trim();
  const district = o.district ? String(o.district).trim() : undefined;
  const state = resolveAddressState(
    o.state != null && String(o.state).trim() ? String(o.state).trim() : undefined
  );
  const legacyName = typeof o.thana === "string" ? o.thana.trim() : undefined;

  let policeStationId = await requirePoliceStationId(o.policeStationId, fieldLabel);
  if (!policeStationId && legacyName) {
    policeStationId = await resolvePoliceStationIdFromLegacy(undefined, legacyName);
    if (!policeStationId) {
      throw new Error(
        `Police station "${legacyName}" is not in the master list. Add it under Admin → Police Stations first.`
      );
    }
  }

  if (!line && !district && !policeStationId) return undefined;

  return {
    line: line || "—",
    ...(policeStationId ? { policeStationId } : {}),
    ...(district ? { district } : {}),
    state,
  };
}

export async function parseHistoryInput(
  rows: unknown
): Promise<CriminalHistoryEntry[]> {
  if (!Array.isArray(rows)) return [];
  const result: CriminalHistoryEntry[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i] as Record<string, unknown>;
    const legacyName =
      typeof row.casePoliceStation === "string"
        ? row.casePoliceStation.trim()
        : typeof row.policeStation === "string"
          ? row.policeStation.trim()
          : undefined;
    const psValue = row.casePoliceStationId ?? row.policeStationId;
    let casePoliceStationId = await requirePoliceStationId(
      psValue,
      `criminal history row ${i + 1} case police station`
    );
    if (!casePoliceStationId && legacyName) {
      casePoliceStationId = await resolvePoliceStationIdFromLegacy(undefined, legacyName);
      if (!casePoliceStationId) {
        throw new Error(
          `History row ${i + 1}: case police station "${legacyName}" is not in the master list.`
        );
      }
    }

    result.push({
      sNo: row.sNo != null ? Number(row.sNo) : undefined,
      year: row.year ? String(row.year).trim() : undefined,
      crimeType: row.crimeType ? String(row.crimeType).trim() : undefined,
      ...(casePoliceStationId ? { casePoliceStationId } : {}),
      firDate: row.firDate ? String(row.firDate).trim() : undefined,
      sectionAct: row.sectionAct ? String(row.sectionAct).trim() : undefined,
    });
  }

  return result;
}

function resolveAddressForApi(
  addr: CriminalAddress | undefined,
  map: PoliceStationNameMap
): CriminalRecord["permanentAddress"] {
  if (!addr) return undefined;
  const id = addr.policeStationId?.toString();
  const thana = id ? map.get(id) : undefined;
  return {
    line: addr.line,
    ...(id ? { policeStationId: id } : {}),
    ...(thana ? { thana } : {}),
    ...(addr.district ? { district: addr.district } : {}),
    ...(addr.state ? { state: addr.state } : {}),
  };
}

function resolveHistoryForApi(
  rows: CriminalHistoryRecord[],
  map: PoliceStationNameMap
): CriminalHistoryRecord[] {
  return rows.map((row) => {
    const id = row.casePoliceStationId;
    const name = id ? map.get(id) : undefined;
    return {
      sNo: row.sNo,
      year: row.year,
      crimeType: row.crimeType,
      ...(id ? { casePoliceStationId: id } : {}),
      ...(name ? { casePoliceStation: name } : {}),
      firDate: row.firDate,
      sectionAct: row.sectionAct,
    };
  });
}

export function enrichCriminalRecord(
  record: CriminalRecord,
  map: PoliceStationNameMap
): CriminalRecord {
  return {
    ...record,
    permanentAddress: resolveAddressForApi(
      record.permanentAddress as CriminalAddress | undefined,
      map
    ),
    presentAddress: resolveAddressForApi(
      record.presentAddress as CriminalAddress | undefined,
      map
    ),
    criminalHistory: resolveHistoryForApi(record.criminalHistory, map),
  };
}

export async function loadPoliceStationNameMap(
  criminals: Criminal[]
): Promise<PoliceStationNameMap> {
  const ids = new Set<string>();
  for (const c of criminals) {
    collectPoliceStationIds(c, ids);
  }
  return PoliceStationModel.findNameMapByIds([...ids].map((id) => new ObjectId(id)));
}

function collectPoliceStationIds(c: Criminal, ids: Set<string>) {
  const add = (id?: ObjectId) => {
    if (id) ids.add(id.toString());
  };
  add(c.permanentAddress?.policeStationId);
  add(c.presentAddress?.policeStationId);
  for (const h of c.criminalHistory ?? []) {
    add(h.casePoliceStationId);
    const legacy = h as { policeStationId?: ObjectId };
    add(legacy.policeStationId);
  }
}

export async function enrichCriminalsFromDocs(
  docs: Criminal[],
  toRecord: (c: Criminal) => CriminalRecord
): Promise<CriminalRecord[]> {
  const map = await loadPoliceStationNameMap(docs);
  return docs.map((doc) => enrichCriminalRecord(toRecord(doc), map));
}

export async function countPoliceStationReferences(
  policeStationId: string
): Promise<number> {
  if (!ObjectId.isValid(policeStationId)) return 0;
  const oid = new ObjectId(policeStationId);
  return CriminalModel.count({
    $or: [
      { "permanentAddress.policeStationId": oid },
      { "presentAddress.policeStationId": oid },
      { "criminalHistory.casePoliceStationId": oid },
      { "criminalHistory.policeStationId": oid },
    ],
  });
}

/** One-time style migration: link legacy text `thana` / `policeStation` to master IDs. */
export async function migratePoliceStationReferences(): Promise<{
  updated: number;
  unmatched: string[];
}> {
  const nameToId = await PoliceStationModel.findAllNameToIdMap();
  const criminals = await CriminalModel.findMany({}, { limit: 50_000 });
  let updated = 0;
  const unmatched = new Set<string>();

  for (const c of criminals) {
    const patch: Partial<Criminal> = {};
    let changed = false;

    const migrateAddr = async (
      key: "permanentAddress" | "presentAddress",
      addr?: CriminalAddress & { thana?: string }
    ) => {
      if (!addr) return;
      if (addr.policeStationId) return;
      const legacy = legacyThana(addr);
      if (!legacy) return;
      const id = nameToId.get(legacy.toLowerCase());
      if (!id) {
        unmatched.add(legacy);
        return;
      }
      const { thana: _removed, ...rest } = addr as CriminalAddress & { thana?: string };
      (patch as Record<string, CriminalAddress>)[key] = {
        ...rest,
        policeStationId: new ObjectId(id),
      };
      changed = true;
    };

    await migrateAddr("permanentAddress", c.permanentAddress);
    await migrateAddr("presentAddress", c.presentAddress);

    const history = [...(c.criminalHistory ?? [])];
    let historyChanged = false;
    for (let i = 0; i < history.length; i++) {
      const row = history[i] as CriminalHistoryEntry & {
        policeStation?: string;
        policeStationId?: ObjectId;
      };
      if (row.casePoliceStationId) continue;
      if (row.policeStationId) {
        history[i] = { ...row, casePoliceStationId: row.policeStationId };
        delete (history[i] as { policeStationId?: ObjectId }).policeStationId;
        historyChanged = true;
        continue;
      }
      const legacy = row.policeStation?.trim();
      if (!legacy) continue;
      const id = nameToId.get(legacy.toLowerCase());
      if (!id) {
        unmatched.add(legacy);
        continue;
      }
      const { policeStation: _removed, ...rest } = row;
      history[i] = { ...rest, casePoliceStationId: new ObjectId(id) };
      historyChanged = true;
    }
    if (historyChanged) {
      patch.criminalHistory = history;
      changed = true;
    }

    if (changed && c._id) {
      await CriminalModel.update(c._id.toString(), patch);
      updated++;
    }
  }

  return { updated, unmatched: [...unmatched] };
}
