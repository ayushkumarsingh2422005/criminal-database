import type { CriminalRecord } from "@/lib/criminal-mapper";
import type { AdminRole } from "@/models/Admin";
import { criminalStatusLabel } from "@/lib/criminal-status";
import { VERIFICATION_STATUS_LABELS } from "@/lib/verification-shared";
import { confessionDocumentFileName } from "@/lib/confession-document";

export const CSV_EXPORT_MAX_ROWS = 10_000;

export type CsvExportGroup =
  | "basic"
  | "address"
  | "livelihood"
  | "physical"
  | "verification"
  | "assignment"
  | "history"
  | "vehicles"
  | "associates"
  | "social"
  | "jail"
  | "documents"
  | "photos"
  | "meta";

export type CsvExportGroupDef = {
  id: CsvExportGroup;
  labelEn: string;
  labelHi: string;
  /** Roles allowed to include this group; omit = all roles */
  roles?: AdminRole[];
};

export const CSV_EXPORT_GROUPS: CsvExportGroupDef[] = [
  { id: "basic", labelEn: "Basic identity", labelHi: "मूल पहचान" },
  { id: "address", labelEn: "Addresses", labelHi: "पता" },
  { id: "livelihood", labelEn: "Livelihood", labelHi: "जीविका" },
  { id: "physical", labelEn: "Physical description", labelHi: "शारीरिक विवरण" },
  { id: "verification", labelEn: "Verification", labelHi: "सत्यापन" },
  { id: "assignment", labelEn: "IO assignment", labelHi: "जांच अधिकारी" },
  { id: "history", labelEn: "Criminal history", labelHi: "आपराधिक इतिहास" },
  { id: "vehicles", labelEn: "Vehicles", labelHi: "वाहन" },
  { id: "associates", labelEn: "Relatives, gang & bailers", labelHi: "संबंधी, गुट व बेलर" },
  { id: "social", labelEn: "Social media", labelHi: "सोशल मीडिया" },
  { id: "jail", labelEn: "Jail visitors", labelHi: "जेल मुलाकाती" },
  { id: "documents", labelEn: "Documents", labelHi: "दस्तावेज़" },
  { id: "photos", labelEn: "Photo paths", labelHi: "फोटो पथ" },
  {
    id: "meta",
    labelEn: "Record metadata",
    labelHi: "रिकॉर्ड मेटाडेटा",
    roles: ["admin", "superadmin"],
  },
];

const GROUP_SET = new Set<CsvExportGroup>(CSV_EXPORT_GROUPS.map((g) => g.id));

export function getAvailableExportGroups(role: AdminRole): CsvExportGroupDef[] {
  return CSV_EXPORT_GROUPS.filter(
    (g) => !g.roles || g.roles.includes(role)
  );
}

export function defaultExportGroups(role: AdminRole): CsvExportGroup[] {
  return getAvailableExportGroups(role).map((g) => g.id);
}

export function parseExportGroups(
  param: string | null,
  role: AdminRole
): CsvExportGroup[] {
  const allowed = new Set(getAvailableExportGroups(role).map((g) => g.id));
  if (!param?.trim()) {
    return defaultExportGroups(role);
  }
  const picked = param
    .split(",")
    .map((s) => s.trim())
    .filter((s): s is CsvExportGroup => GROUP_SET.has(s as CsvExportGroup))
    .filter((s) => allowed.has(s));
  return picked.length ? picked : defaultExportGroups(role);
}

type CsvColumn = { key: string; header: string; group: CsvExportGroup };

function escapeCsv(value: unknown): string {
  if (value == null || value === "") return "";
  const s = String(value);
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function formatDate(value?: Date | string): string {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toISOString().slice(0, 10);
}

function formatHistory(record: CriminalRecord): string {
  return (record.criminalHistory ?? [])
    .map((h) => {
      const parts = [
        h.year,
        h.crimeType,
        h.casePoliceStation && `@ ${h.casePoliceStation}`,
        h.firNo && `FIR ${h.firNo}`,
        h.firDate && `(${h.firDate})`,
        h.sectionAct,
      ].filter(Boolean);
      return parts.join(" ");
    })
    .join(" | ");
}

function formatVehicles(record: CriminalRecord): string {
  return (record.vehicles ?? [])
    .map((v) =>
      [v.vehicleNumber, v.otherDetails, v.remarks].filter(Boolean).join(" — ")
    )
    .join(" | ");
}

function formatRelatives(record: CriminalRecord): string {
  return (record.closeRelatives ?? [])
    .map((r) =>
      [r.relation, r.name, r.mobileNumber, r.address, r.aadhaarNumber]
        .filter(Boolean)
        .join(", ")
    )
    .join(" | ");
}

function formatGang(record: CriminalRecord): string {
  return (record.gangMembers ?? [])
    .map((g) =>
      [g.relation, g.name, g.mobileNumber, g.vehicle, g.address]
        .filter(Boolean)
        .join(", ")
    )
    .join(" | ");
}

function formatBailers(record: CriminalRecord): string {
  return (record.bailers ?? [])
    .map((b) =>
      [b.name, b.fatherName, b.mobileNumber, b.propertyDetails, b.firDetails]
        .filter(Boolean)
        .join(", ")
    )
    .join(" | ");
}

function formatSocial(record: CriminalRecord): string {
  return (record.socialMediaAccounts ?? [])
    .map((s) => `${s.platform}: ${s.idDetails}`)
    .join(" | ");
}

function formatJailVisitors(record: CriminalRecord): string {
  return (record.jailVisitors ?? [])
    .map((v) =>
      [
        v.name,
        v.fatherName,
        v.mobileNumber,
        v.reasonOfVisit,
        v.vehicle,
        v.remarks,
      ]
        .filter(Boolean)
        .join(", ")
    )
    .join(" | ");
}

function formatVerificationHistory(record: CriminalRecord): string {
  return (record.verificationHistory ?? [])
    .map((v) =>
      [formatDate(v.verifiedAt), v.officerName, v.remark].filter(Boolean).join(" — ")
    )
    .join(" | ");
}

function buildColumns(groups: CsvExportGroup[]): CsvColumn[] {
  const set = new Set(groups);
  const cols: CsvColumn[] = [];

  const add = (group: CsvExportGroup, key: string, header: string) => {
    if (set.has(group)) cols.push({ key, header, group });
  };

  add("basic", "pid", "PID");
  add("basic", "name", "Name");
  add("basic", "nameAliases", "Name aliases");
  add("basic", "dateOfBirth", "Date of birth");
  add("basic", "fatherName", "Father name");
  add("basic", "fatherNameAliases", "Father aliases");
  add("basic", "mobileNumber", "Mobile");
  add("basic", "aadhaarNumber", "Aadhaar");
  add("basic", "aadhaarVerified", "Aadhaar verified");
  add("basic", "criminalStatus", "Criminal status");

  add("address", "permanentLine", "Permanent address");
  add("address", "permanentThana", "Permanent PS / थाना");
  add("address", "permanentDistrict", "Permanent district");
  add("address", "permanentState", "Permanent state");
  add("address", "presentLine", "Present address");
  add("address", "presentThana", "Present PS / थाना");
  add("address", "presentDistrict", "Present district");
  add("address", "presentState", "Present state");

  add("livelihood", "livelihoodMeans", "Livelihood means");
  add("livelihood", "livelihoodVerification", "Livelihood verification");

  add("physical", "height", "Height");
  add("physical", "complexion", "Complexion");
  add("physical", "build", "Build");
  add("physical", "identificationMarks", "Identification marks");
  add("physical", "deformity", "Deformity");

  add("verification", "verificationStatus", "Verification status");
  add("verification", "lastVerifiedAt", "Last verified");
  add("verification", "nextVerificationDue", "Next verification due");
  add("verification", "verificationFrequencyDays", "Verification frequency (days)");
  add("verification", "verificationHistory", "Verification history");

  add("assignment", "assignedIoName", "Assigned IO");
  add("assignment", "assignedIoId", "Assigned IO ID");

  add("history", "criminalHistory", "Criminal history");

  add("vehicles", "vehicles", "Vehicles");

  add("associates", "closeRelatives", "Close relatives");
  add("associates", "gangMembers", "Gang members");
  add("associates", "bailers", "Bailers");

  add("social", "socialMediaAccounts", "Social media accounts");

  add("jail", "jailVisitors", "Jail visitors");

  add("documents", "confessionDocument", "Confession document");

  add("photos", "photoFrontFull", "Photo front full");
  add("photos", "photoLeftProfile", "Photo left profile");
  add("photos", "photoRightProfile", "Photo right profile");
  add("photos", "photoFront", "Photo front");

  add("meta", "id", "Record ID");
  add("meta", "createdAt", "Created at");
  add("meta", "updatedAt", "Updated at");

  return cols;
}

function cellValue(record: CriminalRecord, key: string): string {
  const p = record.permanentAddress;
  const pr = record.presentAddress;
  const phys = record.physicalDescription ?? {};
  const photos = record.photos ?? {};

  switch (key) {
    case "pid":
      return record.pid;
    case "name":
      return record.name ?? "";
    case "nameAliases":
      return record.nameAliases ?? "";
    case "dateOfBirth":
      return record.dateOfBirth ?? "";
    case "fatherName":
      return record.fatherName ?? "";
    case "fatherNameAliases":
      return record.fatherNameAliases ?? "";
    case "mobileNumber":
      return record.mobileNumber ?? "";
    case "aadhaarNumber":
      return record.aadhaarNumber ?? "";
    case "aadhaarVerified":
      return record.aadhaarVerified ? "Yes" : "No";
    case "criminalStatus":
      return criminalStatusLabel(record.criminalStatus);
    case "permanentLine":
      return p?.line ?? "";
    case "permanentThana":
      return p?.thana ?? "";
    case "permanentDistrict":
      return p?.district ?? "";
    case "permanentState":
      return p?.state ?? "";
    case "presentLine":
      return pr?.line ?? "";
    case "presentThana":
      return pr?.thana ?? "";
    case "presentDistrict":
      return pr?.district ?? "";
    case "presentState":
      return pr?.state ?? "";
    case "livelihoodMeans":
      return record.livelihoodMeans ?? "";
    case "livelihoodVerification":
      return record.livelihoodVerification ?? "";
    case "height":
      return phys.height ?? "";
    case "complexion":
      return phys.complexion ?? "";
    case "build":
      return phys.build ?? "";
    case "identificationMarks":
      return phys.identificationMarks ?? "";
    case "deformity":
      return phys.deformity ?? "";
    case "verificationStatus":
      return record.verificationStatus
        ? VERIFICATION_STATUS_LABELS[record.verificationStatus].en
        : "";
    case "lastVerifiedAt":
      return formatDate(record.lastVerifiedAt);
    case "nextVerificationDue":
      return formatDate(record.nextVerificationDue);
    case "verificationFrequencyDays":
      return record.verificationFrequencyDays != null
        ? String(record.verificationFrequencyDays)
        : "";
    case "verificationHistory":
      return formatVerificationHistory(record);
    case "assignedIoName":
      return record.assignedIoName ?? "";
    case "assignedIoId":
      return record.assignedIoId ?? "";
    case "criminalHistory":
      return formatHistory(record);
    case "vehicles":
      return formatVehicles(record);
    case "closeRelatives":
      return formatRelatives(record);
    case "gangMembers":
      return formatGang(record);
    case "bailers":
      return formatBailers(record);
    case "socialMediaAccounts":
      return formatSocial(record);
    case "jailVisitors":
      return formatJailVisitors(record);
    case "confessionDocument":
      return confessionDocumentFileName(record.confessionDocument) ?? record.confessionDocument ?? "";
    case "photoFrontFull":
      return photos.frontFull ?? "";
    case "photoLeftProfile":
      return photos.leftProfile ?? "";
    case "photoRightProfile":
      return photos.rightProfile ?? "";
    case "photoFront":
      return photos.front ?? "";
    case "id":
      return record.id;
    case "createdAt":
      return formatDate(record.createdAt);
    case "updatedAt":
      return formatDate(record.updatedAt);
    default:
      return "";
  }
}

export function criminalsToCsv(
  records: CriminalRecord[],
  groups: CsvExportGroup[]
): string {
  const columns = buildColumns(groups);
  if (!columns.length) {
    return "\uFEFF";
  }

  const header = columns.map((c) => escapeCsv(c.header)).join(",");
  const rows = records.map((record) =>
    columns.map((c) => escapeCsv(cellValue(record, c.key))).join(",")
  );

  return `\uFEFF${[header, ...rows].join("\r\n")}`;
}
