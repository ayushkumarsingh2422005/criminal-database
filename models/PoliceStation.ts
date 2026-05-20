import { ObjectId, type Collection } from "mongodb";
import { getDb, COLLECTIONS } from "@/lib/db";

export interface PoliceStation {
  _id?: ObjectId;
  name: string;
  active: boolean;
  createdAt: Date;
}

export async function getPoliceStationCollection(): Promise<Collection<PoliceStation>> {
  const db = await getDb();
  return db.collection<PoliceStation>(COLLECTIONS.policeStations);
}

export const PoliceStationModel = {
  async findAllActive() {
    return (await getPoliceStationCollection())
      .find({ active: true })
      .sort({ name: 1 })
      .toArray();
  },

  async findById(id: string) {
    if (!ObjectId.isValid(id)) return null;
    return (await getPoliceStationCollection()).findOne({ _id: new ObjectId(id) });
  },

  async findByNameInsensitive(name: string) {
    return (await getPoliceStationCollection()).findOne({
      name: { $regex: `^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" },
    });
  },

  async findNameMapByIds(ids: ObjectId[]): Promise<Map<string, string>> {
    const map = new Map<string, string>();
    if (ids.length === 0) return map;
    const items = await (await getPoliceStationCollection())
      .find({ _id: { $in: ids } })
      .toArray();
    for (const s of items) {
      map.set(s._id!.toString(), s.name);
    }
    return map;
  },

  /** Lowercase station name → id string (all stations, for migration). */
  async findAllNameToIdMap(): Promise<Map<string, string>> {
    const items = await (await getPoliceStationCollection()).find({}).toArray();
    const map = new Map<string, string>();
    for (const s of items) {
      map.set(s.name.trim().toLowerCase(), s._id!.toString());
    }
    return map;
  },

  async count() {
    return (await getPoliceStationCollection()).countDocuments();
  },

  async insertMany(items: Omit<PoliceStation, "_id">[]) {
    return (await getPoliceStationCollection()).insertMany(items);
  },

  async create(data: Omit<PoliceStation, "_id">) {
    const result = await (await getPoliceStationCollection()).insertOne(data);
    return { ...data, _id: result.insertedId };
  },

  async update(id: string, update: Partial<PoliceStation>) {
    return (await getPoliceStationCollection()).findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: update },
      { returnDocument: "after" }
    );
  },

  async softDelete(id: string) {
    return (await getPoliceStationCollection()).updateOne(
      { _id: new ObjectId(id) },
      { $set: { active: false } }
    );
  },
};
