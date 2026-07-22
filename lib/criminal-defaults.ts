import type { CriminalHistoryRecord } from "@/lib/criminal-mapper";
import type {
  Criminal,
  CriminalVehicle,
  PhysicalDescription,
  RelatedPerson,
  BailerInfo,
  SocialMediaAccount,
  JailVisitor,
} from "@/models/Criminal";

export const emptyPhysical = (): PhysicalDescription => ({
  height: "",
  complexion: "",
  build: "",
  identificationMarks: "",
  deformity: "",
});

export const emptyHistory = (): CriminalHistoryRecord => ({
  sNo: 1,
  year: "",
  crimeType: "",
  casePoliceStationId: "",
  firNo: "",
  firDate: "",
  sectionAct: "",
});

export const emptyVehicle = (): CriminalVehicle => ({
  vehicleNumber: "",
  otherDetails: "",
  remarks: "",
});

export const emptyRelative = (): RelatedPerson => ({
  relation: "",
  name: "",
  address: "",
  mobileNumber: "",
  aadhaarNumber: "",
});

export const emptyGangMember = (): RelatedPerson => ({
  ...emptyRelative(),
  vehicle: "",
});

export const emptyBailer = (): BailerInfo => ({
  name: "",
  fatherName: "",
  address: "",
  mobileNumber: "",
  aadhaarNumber: "",
  propertyDetails: "",
  firDetails: "",
});

export const emptySocialMedia = (): SocialMediaAccount => ({
  platform: "",
  idDetails: "",
});

export const emptyJailVisitor = (): JailVisitor => ({
  name: "",
  fatherName: "",
  address: "",
  mobileNumber: "",
  idProof: "",
  idNumber: "",
  reasonOfVisit: "",
  vehicle: "",
  remarks: "",
});

export function withExtendedDefaults(
  partial: Partial<Criminal>
): Pick<
  Criminal,
  | "criminalHistory"
  | "vehicles"
  | "physicalDescription"
  | "closeRelatives"
  | "gangMembers"
  | "bailers"
  | "socialMediaAccounts"
  | "jailVisitors"
  | "confessionDocument"
> {
  return {
    criminalHistory: partial.criminalHistory ?? [],
    vehicles: partial.vehicles ?? [],
    physicalDescription: partial.physicalDescription ?? emptyPhysical(),
    closeRelatives: partial.closeRelatives ?? [],
    gangMembers: partial.gangMembers ?? [],
    bailers: partial.bailers ?? [],
    socialMediaAccounts: partial.socialMediaAccounts ?? [],
    jailVisitors: partial.jailVisitors ?? [],
    confessionDocument: partial.confessionDocument ?? "",
  };
}
