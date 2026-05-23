import type {
  Criminal,
  CriminalAddress,
  CriminalPhotos,
  CriminalVehicle,
  PhysicalDescription,
  RelatedPerson,
  BailerInfo,
  VerificationInfo,
} from "@/models/Criminal";
import { withExtendedDefaults, emptyPhysical } from "./criminal-defaults";
import {
  parseAddressInput,
  parseHistoryInput,
} from "./police-station-ref";

export type CriminalHistoryRecord = {
  sNo?: number;
  year?: string;
  crimeType?: string;
  casePoliceStationId?: string;
  /** Resolved from master list at read time */
  casePoliceStation?: string;
  firDate?: string;
  sectionAct?: string;
};

export interface CriminalRecord {
  id: string;
  pid: string;
  name: string;
  nameAliases?: string;
  dateOfBirth?: string;
  aadhaarNumber?: string;
  aadhaarVerified?: boolean;
  fatherName?: string;
  fatherNameAliases?: string;
  mobileNumber?: string;
  permanentAddress?: {
    line: string;
    policeStationId?: string;
    thana?: string;
    district?: string;
  };
  presentAddress?: {
    line: string;
    policeStationId?: string;
    thana?: string;
    district?: string;
  };
  livelihoodMeans?: string;
  livelihoodVerification?: string;
  photos: CriminalPhotos;
  criminalHistory: CriminalHistoryRecord[];
  vehicles: CriminalVehicle[];
  physicalDescription: PhysicalDescription;
  closeRelatives: RelatedPerson[];
  gangMembers: RelatedPerson[];
  bailers: BailerInfo[];
  confessionStatement?: string;
  verification: VerificationInfo;
  createdAt?: Date;
  updatedAt?: Date;
}

function arr<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

function mapAddress(addr?: CriminalAddress): CriminalRecord["permanentAddress"] {
  if (!addr) return undefined;
  const id = addr.policeStationId?.toString();
  return {
    line: addr.line,
    ...(id ? { policeStationId: id } : {}),
    ...(addr.district ? { district: addr.district } : {}),
  };
}

function mapHistory(
  rows: Criminal["criminalHistory"]
): CriminalHistoryRecord[] {
  return (rows ?? []).map((row) => {
    const id = row.casePoliceStationId?.toString();
    return {
      sNo: row.sNo,
      year: row.year,
      crimeType: row.crimeType,
      ...(id ? { casePoliceStationId: id } : {}),
      firDate: row.firDate,
      sectionAct: row.sectionAct,
    };
  });
}

export function normalizeCriminal(doc: Record<string, unknown>): Criminal {
  const base = doc as unknown as Criminal;
  const ext = withExtendedDefaults(base);
  return {
    ...(base as Criminal),
    photos: base.photos ?? {},
    ...ext,
  };
}

export function toCriminalRecord(c: Criminal): CriminalRecord {
  const n = normalizeCriminal(c as unknown as Record<string, unknown>);
  return {
    id: c._id!.toString(),
    pid: n.pid,
    name: n.name,
    nameAliases: n.nameAliases,
    dateOfBirth: n.dateOfBirth,
    aadhaarNumber: n.aadhaarNumber,
    aadhaarVerified: n.aadhaarVerified,
    fatherName: n.fatherName,
    fatherNameAliases: n.fatherNameAliases,
    mobileNumber: n.mobileNumber,
    permanentAddress: mapAddress(n.permanentAddress),
    presentAddress: mapAddress(n.presentAddress),
    livelihoodMeans: n.livelihoodMeans,
    livelihoodVerification: n.livelihoodVerification,
    photos: n.photos ?? {},
    criminalHistory: mapHistory(n.criminalHistory),
    vehicles: n.vehicles,
    physicalDescription: n.physicalDescription ?? emptyPhysical(),
    closeRelatives: n.closeRelatives,
    gangMembers: n.gangMembers,
    bailers: n.bailers,
    confessionStatement: n.confessionStatement,
    verification: n.verification ?? {},
    createdAt: n.createdAt,
    updatedAt: n.updatedAt,
  };
}

export async function parseCriminalBody(
  body: Record<string, unknown>
): Promise<Omit<Criminal, "_id">> {
  const photos = (body.photos as CriminalPhotos) ?? {};
  const ext = withExtendedDefaults({
    criminalHistory: await parseHistoryInput(body.criminalHistory),
    vehicles: arr(body.vehicles),
    physicalDescription:
      (body.physicalDescription as PhysicalDescription) ?? emptyPhysical(),
    closeRelatives: arr(body.closeRelatives),
    gangMembers: arr(body.gangMembers),
    bailers: arr(body.bailers),
    confessionStatement: body.confessionStatement
      ? String(body.confessionStatement)
      : "",
    verification: (body.verification as VerificationInfo) ?? {},
  });

  return {
    pid: String(body.pid ?? "").trim(),
    name: String(body.name ?? "").trim(),
    nameAliases: body.nameAliases ? String(body.nameAliases).trim() : undefined,
    dateOfBirth: body.dateOfBirth ? String(body.dateOfBirth).trim() : undefined,
    aadhaarNumber: body.aadhaarNumber
      ? String(body.aadhaarNumber).trim()
      : undefined,
    aadhaarVerified: Boolean(body.aadhaarVerified),
    fatherName: body.fatherName ? String(body.fatherName).trim() : undefined,
    fatherNameAliases: body.fatherNameAliases
      ? String(body.fatherNameAliases).trim()
      : undefined,
    mobileNumber: body.mobileNumber ? String(body.mobileNumber).trim() : undefined,
    permanentAddress: await parseAddressInput(
      body.permanentAddress,
      "permanent address"
    ),
    presentAddress: await parseAddressInput(body.presentAddress, "present address"),
    livelihoodMeans: body.livelihoodMeans
      ? String(body.livelihoodMeans).trim()
      : undefined,
    livelihoodVerification: body.livelihoodVerification
      ? String(body.livelihoodVerification).trim()
      : undefined,
    photos: {
      frontFull: photos.frontFull || undefined,
      leftProfile: photos.leftProfile || undefined,
      rightProfile: photos.rightProfile || undefined,
      front: photos.front || undefined,
    },
    ...ext,
  };
}
