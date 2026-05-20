import { ObjectId, type Collection } from "mongodb";
import { getDb, COLLECTIONS } from "@/lib/db";

export type TransferStatus = "pending" | "accepted" | "rejected" | "cancelled";

export interface CriminalTransfer {
  _id?: ObjectId;
  criminalId: ObjectId;
  fromPoliceStationId: ObjectId;
  toPoliceStationId: ObjectId;
  requestedByAdminId: ObjectId;
  status: TransferStatus;
  message?: string;
  respondedByAdminId?: ObjectId;
  createdAt: Date;
  updatedAt: Date;
  respondedAt?: Date;
}

export async function getTransferCollection(): Promise<
  Collection<CriminalTransfer>
> {
  const db = await getDb();
  return db.collection<CriminalTransfer>(COLLECTIONS.criminalTransfers);
}

export const CriminalTransferModel = {
  async findById(id: string) {
    if (!ObjectId.isValid(id)) return null;
    return (await getTransferCollection()).findOne({ _id: new ObjectId(id) });
  },

  async findPendingByCriminalId(criminalId: ObjectId) {
    return (await getTransferCollection()).findOne({
      criminalId,
      status: "pending",
    });
  },

  async findByPoliceStation(policeStationId: ObjectId) {
    const col = await getTransferCollection();
    const [outgoing, incoming] = await Promise.all([
      col
        .find({ fromPoliceStationId: policeStationId })
        .sort({ createdAt: -1 })
        .limit(100)
        .toArray(),
      col
        .find({ toPoliceStationId: policeStationId })
        .sort({ createdAt: -1 })
        .limit(100)
        .toArray(),
    ]);
    return { outgoing, incoming };
  },

  async create(data: Omit<CriminalTransfer, "_id">) {
    const result = await (await getTransferCollection()).insertOne(data);
    return (await getTransferCollection()).findOne({ _id: result.insertedId });
  },

  async updateStatus(
    id: string,
    status: TransferStatus,
    extra?: Partial<CriminalTransfer>
  ) {
    return (await getTransferCollection()).findOneAndUpdate(
      { _id: new ObjectId(id), status: "pending" },
      {
        $set: {
          status,
          updatedAt: new Date(),
          respondedAt: new Date(),
          ...extra,
        },
      },
      { returnDocument: "after" }
    );
  },
};
