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

  async findByNameInsensitive(name: string) {
    return (await getPoliceStationCollection()).findOne({
      name: { $regex: `^${name}$`, $options: "i" },
    });
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
