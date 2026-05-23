import type { CriminalHistoryRecord } from "@/lib/criminal-mapper";
import type {
  Criminal,
  CriminalVehicle,
  PhysicalDescription,
  RelatedPerson,
  BailerInfo,
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
  | "confessionStatement"
> {
  return {
    criminalHistory: partial.criminalHistory ?? [],
    vehicles: partial.vehicles ?? [],
    physicalDescription: partial.physicalDescription ?? emptyPhysical(),
    closeRelatives: partial.closeRelatives ?? [],
    gangMembers: partial.gangMembers ?? [],
    bailers: partial.bailers ?? [],
    confessionStatement: partial.confessionStatement ?? "",
  };
}
