import type {
  Criminal,
  CriminalPhotos,
  CriminalHistoryEntry,
  CriminalVehicle,
  PhysicalDescription,
  RelatedPerson,
  BailerInfo,
  VerificationInfo,
} from "@/models/Criminal";
import { withExtendedDefaults, emptyPhysical } from "./criminal-defaults";

export interface CriminalRecord {
  id: string;
  pid: string;
  crimeTypes: string[];
  name: string;
  nameAliases?: string;
  dateOfBirth?: string;
  aadhaarNumber?: string;
  aadhaarVerified?: boolean;
  fatherName?: string;
  fatherNameAliases?: string;
  mobileNumber?: string;
  permanentAddress?: { line: string; thana?: string; district?: string };
  presentAddress?: { line: string; thana?: string; district?: string };
  livelihoodMeans?: string;
  livelihoodVerification?: string;
  photos: CriminalPhotos;
  criminalHistory: CriminalHistoryEntry[];
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

export function normalizeCriminal(doc: Record<string, unknown>): Criminal {
  const base = doc as unknown as Criminal;
  const ext = withExtendedDefaults(base);
  return {
    ...(base as Criminal),
    photos: base.photos ?? {},
    crimeTypes: base.crimeTypes ?? [],
    ...ext,
  };
}

export function toCriminalRecord(c: Criminal): CriminalRecord {
  const n = normalizeCriminal(c as unknown as Record<string, unknown>);
  return {
    id: c._id!.toString(),
    pid: n.pid,
    crimeTypes: n.crimeTypes ?? [],
    name: n.name,
    nameAliases: n.nameAliases,
    dateOfBirth: n.dateOfBirth,
    aadhaarNumber: n.aadhaarNumber,
    aadhaarVerified: n.aadhaarVerified,
    fatherName: n.fatherName,
    fatherNameAliases: n.fatherNameAliases,
    mobileNumber: n.mobileNumber,
    permanentAddress: n.permanentAddress,
    presentAddress: n.presentAddress,
    livelihoodMeans: n.livelihoodMeans,
    livelihoodVerification: n.livelihoodVerification,
    photos: n.photos ?? {},
    criminalHistory: n.criminalHistory,
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

export function parseCriminalBody(body: Record<string, unknown>): Omit<Criminal, "_id"> {
  const photos = (body.photos as CriminalPhotos) ?? {};
  const ext = withExtendedDefaults({
    criminalHistory: arr(body.criminalHistory),
    vehicles: arr(body.vehicles),
    physicalDescription: (body.physicalDescription as PhysicalDescription) ?? emptyPhysical(),
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
    crimeTypes: Array.isArray(body.crimeTypes)
      ? body.crimeTypes.map(String)
      : body.crimeTypes
        ? [String(body.crimeTypes)]
        : [],
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
    permanentAddress: body.permanentAddress as Criminal["permanentAddress"],
    presentAddress: body.presentAddress as Criminal["presentAddress"],
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
