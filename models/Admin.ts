import { ObjectId, type Collection } from "mongodb";
import { getDb, COLLECTIONS } from "@/lib/db";

export type AdminRole = "superadmin" | "admin" | "io";

export interface Admin {
  _id?: ObjectId;
  email: string;
  passwordHash: string;
  name: string;
  role: AdminRole;
  /** Required for `admin` and `io` — PS scope. */
  policeStationId?: ObjectId;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export async function getAdminCollection(): Promise<Collection<Admin>> {
  const db = await getDb();
  return db.collection<Admin>(COLLECTIONS.admins);
}

export const AdminModel = {
  async count() {
    return (await getAdminCollection()).countDocuments();
  },

  async findAll() {
    return (await getAdminCollection()).find({}).sort({ createdAt: -1 }).toArray();
  },

  async findByEmail(email: string) {
    return (await getAdminCollection()).findOne({ email: email.toLowerCase() });
  },

  async findActiveByEmail(email: string) {
    return (await getAdminCollection()).findOne({
      email: email.toLowerCase(),
      active: true,
    });
  },

  async findById(id: string | ObjectId) {
    const _id = typeof id === "string" ? new ObjectId(id) : id;
    return (await getAdminCollection()).findOne({ _id });
  },

  async findInvestigationOfficers(policeStationId?: ObjectId) {
    const filter: { role: "io"; policeStationId?: ObjectId } = { role: "io" };
    if (policeStationId) filter.policeStationId = policeStationId;
    return (await getAdminCollection())
      .find(filter)
      .sort({ name: 1 })
      .toArray();
  },

  async create(data: Omit<Admin, "_id">) {
    const result = await (await getAdminCollection()).insertOne(data);
    return (await getAdminCollection()).findOne({ _id: result.insertedId });
  },

  async update(id: string, update: Partial<Admin>) {
    return (await getAdminCollection()).findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: update },
      { returnDocument: "after" }
    );
  },

  async delete(id: string) {
    return (await getAdminCollection()).deleteOne({ _id: new ObjectId(id) });
  },
};
