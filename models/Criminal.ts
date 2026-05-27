import { ObjectId, type Collection, type Filter } from "mongodb";
import { getDb, COLLECTIONS } from "@/lib/db";

export interface CriminalAddress {
  line: string;
  /** Reference to `police_stations` collection — name resolved at read time. */
  policeStationId?: ObjectId;
  district?: string;
  state?: string;
}

export interface CriminalPhotos {
  frontFull?: string;
  leftProfile?: string;
  rightProfile?: string;
  front?: string;
}

export interface CriminalHistoryEntry {
  sNo?: number;
  year?: string;
  crimeType?: string;
  /** Case police station — reference to `police_stations` (name resolved at read time). */
  casePoliceStationId?: ObjectId;
  firDate?: string;
  sectionAct?: string;
}

export interface CriminalVehicle {
  vehicleNumber?: string;
  otherDetails?: string;
  remarks?: string;
}

export interface PhysicalDescription {
  height?: string;
  complexion?: string;
  build?: string;
  identificationMarks?: string;
  deformity?: string;
}

export interface RelatedPerson {
  relation?: string;
  name?: string;
  address?: string;
  mobileNumber?: string;
  aadhaarNumber?: string;
  vehicle?: string;
}

export interface BailerInfo {
  name?: string;
  fatherName?: string;
  address?: string;
  mobileNumber?: string;
  aadhaarNumber?: string;
  propertyDetails?: string;
  firDetails?: string;
}

export interface VerificationRecord {
  /** ISO 8601 date-time when verification was recorded */
  verifiedAt: string;
  officerName: string;
  officerId?: string;
  remark?: string;
}

/** @deprecated Use verificationHistory */
export interface VerificationInfo {
  verificationDate?: string;
  verifyingOfficer?: string;
}

export interface Criminal {
  _id?: ObjectId;
  pid: string;
  name: string;
  nameAliases?: string;
  dateOfBirth?: string;
  aadhaarNumber?: string;
  aadhaarVerified?: boolean;
  fatherName?: string;
  fatherNameAliases?: string;
  mobileNumber?: string;
  permanentAddress?: CriminalAddress;
  presentAddress?: CriminalAddress;
  livelihoodMeans?: string;
  livelihoodVerification?: string;
  photos: CriminalPhotos;
  criminalHistory: CriminalHistoryEntry[];
  vehicles: CriminalVehicle[];
  physicalDescription?: PhysicalDescription;
  closeRelatives: RelatedPerson[];
  gangMembers: RelatedPerson[];
  bailers: BailerInfo[];
  confessionStatement?: string;
  verificationHistory?: VerificationRecord[];
  /** @deprecated Migrated to verificationHistory */
  verification?: VerificationInfo;
  /** Assigned investigation officer (`admins` with role `io`). */
  assignedIoId?: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
}

export type CriminalInput = Omit<
  Criminal,
  "_id" | "createdAt" | "updatedAt" | "createdBy"
>;

export async function getCriminalCollection(): Promise<Collection<Criminal>> {
  const db = await getDb();
  return db.collection<Criminal>(COLLECTIONS.criminals);
}

export const CriminalModel = {
  async findMany(
    filter: Filter<Criminal> = {},
    options: { skip?: number; limit?: number } = {}
  ) {
    let query = (await getCriminalCollection())
      .find(filter)
      .sort({ createdAt: -1, pid: 1 });
    if (options.skip) query = query.skip(options.skip);
    if (options.limit) query = query.limit(options.limit);
    return query.toArray();
  },

  async count(filter: Filter<Criminal> = {}) {
    return (await getCriminalCollection()).countDocuments(filter);
  },

  async findById(id: string) {
    return (await getCriminalCollection()).findOne({ _id: new ObjectId(id) });
  },

  async findByPid(pid: string) {
    return (await getCriminalCollection()).findOne({ pid });
  },

  async create(data: Criminal) {
    const result = await (await getCriminalCollection()).insertOne(data);
    return (await getCriminalCollection()).findOne({ _id: result.insertedId });
  },

  async update(id: string, update: Partial<Criminal>) {
    return (await getCriminalCollection()).findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: update },
      { returnDocument: "after" }
    );
  },

  async delete(id: string) {
    return (await getCriminalCollection()).deleteOne({ _id: new ObjectId(id) });
  },
};
