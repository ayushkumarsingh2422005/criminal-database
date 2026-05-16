import { ObjectId, type Collection } from "mongodb";
import { getDb, COLLECTIONS } from "@/lib/db";

export interface CaseType {
  _id?: ObjectId;
  name: string;
  active: boolean;
  createdAt: Date;
}

export async function getCaseTypeCollection(): Promise<Collection<CaseType>> {
  const db = await getDb();
  return db.collection<CaseType>(COLLECTIONS.caseTypes);
}

export const CaseTypeModel = {
  async findAllActive() {
    return (await getCaseTypeCollection())
      .find({ active: true })
      .sort({ name: 1 })
      .toArray();
  },

  async findByNameInsensitive(name: string) {
    return (await getCaseTypeCollection()).findOne({
      name: { $regex: `^${name}$`, $options: "i" },
    });
  },

  async count() {
    return (await getCaseTypeCollection()).countDocuments();
  },

  async insertMany(items: Omit<CaseType, "_id">[]) {
    return (await getCaseTypeCollection()).insertMany(items);
  },

  async create(data: Omit<CaseType, "_id">) {
    const result = await (await getCaseTypeCollection()).insertOne(data);
    return { ...data, _id: result.insertedId };
  },

  async update(id: string, update: Partial<CaseType>) {
    return (await getCaseTypeCollection()).findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: update },
      { returnDocument: "after" }
    );
  },

  async softDelete(id: string) {
    return (await getCaseTypeCollection()).updateOne(
      { _id: new ObjectId(id) },
      { $set: { active: false } }
    );
  },
};
