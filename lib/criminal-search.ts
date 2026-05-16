import type { Filter } from "mongodb";
import type { Criminal } from "@/models/Criminal";

export interface CriminalSearchFilters {
  name: string;
  pid: string;
  mobileNumber: string;
  crimeType: string;
  fatherName: string;
  district: string;
  thana: string;
  aadhaarNumber: string;
  firNumber: string;
  caseNumber: string;
  sectionAct: string;
  historyPoliceStation: string;
  court: string;
  judgeName: string;
  vehicleNumber: string;
  identificationMarks: string;
  associateName: string;
  associateMobile: string;
  associateAadhaar: string;
  bailerName: string;
}

export const emptySearchFilters = (): CriminalSearchFilters => ({
  name: "",
  pid: "",
  mobileNumber: "",
  crimeType: "all",
  fatherName: "",
  district: "",
  thana: "",
  aadhaarNumber: "",
  firNumber: "",
  caseNumber: "",
  sectionAct: "",
  historyPoliceStation: "",
  court: "",
  judgeName: "",
  vehicleNumber: "",
  identificationMarks: "",
  associateName: "",
  associateMobile: "",
  associateAadhaar: "",
  bailerName: "",
});

function regex(value: string) {
  return { $regex: value, $options: "i" as const };
}

function pushRegex(conditions: Filter<Criminal>[], field: string, value: string | null) {
  if (!value?.trim()) return;
  conditions.push({ [field]: regex(value.trim()) } as Filter<Criminal>);
}

export function buildCriminalFilter(
  params: URLSearchParams | CriminalSearchFilters
): Filter<Criminal> {
  const get = (key: keyof CriminalSearchFilters) =>
    params instanceof URLSearchParams
      ? params.get(key)
      : params[key] || null;

  const conditions: Filter<Criminal>[] = [];

  pushRegex(conditions, "name", get("name"));
  pushRegex(conditions, "pid", get("pid"));
  pushRegex(conditions, "mobileNumber", get("mobileNumber"));
  pushRegex(conditions, "fatherName", get("fatherName"));
  pushRegex(conditions, "aadhaarNumber", get("aadhaarNumber"));

  const crimeType = get("crimeType");
  if (crimeType && crimeType !== "all") {
    conditions.push({ crimeTypes: crimeType });
  }

  const district = get("district");
  if (district?.trim()) {
    conditions.push({
      $or: [
        { "permanentAddress.district": regex(district.trim()) },
        { "presentAddress.district": regex(district.trim()) },
      ],
    });
  }

  const thana = get("thana");
  if (thana?.trim()) {
    conditions.push({
      $or: [
        { "permanentAddress.thana": regex(thana.trim()) },
        { "presentAddress.thana": regex(thana.trim()) },
      ],
    });
  }

  pushRegex(conditions, "criminalHistory.firNumber", get("firNumber"));
  pushRegex(conditions, "criminalHistory.caseNumber", get("caseNumber"));
  pushRegex(conditions, "criminalHistory.sectionAct", get("sectionAct"));
  pushRegex(conditions, "criminalHistory.policeStation", get("historyPoliceStation"));
  pushRegex(conditions, "criminalHistory.court", get("court"));
  pushRegex(conditions, "criminalHistory.judgeName", get("judgeName"));

  const vehicleNumber = get("vehicleNumber");
  if (vehicleNumber?.trim()) {
    const r = regex(vehicleNumber.trim());
    conditions.push({
      $or: [{ "vehicles.vehicleNumber": r }, { "vehicles.otherDetails": r }],
    });
  }

  pushRegex(
    conditions,
    "physicalDescription.identificationMarks",
    get("identificationMarks")
  );

  const associateName = get("associateName");
  if (associateName?.trim()) {
    const r = regex(associateName.trim());
    conditions.push({
      $or: [
        { "closeRelatives.name": r },
        { "gangMembers.name": r },
        { "bailers.name": r },
        { "closeRelatives.relation": r },
        { "gangMembers.relation": r },
      ],
    });
  }

  const associateMobile = get("associateMobile");
  if (associateMobile?.trim()) {
    const r = regex(associateMobile.trim());
    conditions.push({
      $or: [
        { "closeRelatives.mobileNumber": r },
        { "gangMembers.mobileNumber": r },
        { "bailers.mobileNumber": r },
      ],
    });
  }

  const associateAadhaar = get("associateAadhaar");
  if (associateAadhaar?.trim()) {
    const r = regex(associateAadhaar.trim());
    conditions.push({
      $or: [
        { "closeRelatives.aadhaarNumber": r },
        { "gangMembers.aadhaarNumber": r },
        { "bailers.aadhaarNumber": r },
      ],
    });
  }

  const bailerName = get("bailerName");
  if (bailerName?.trim()) {
    const r = regex(bailerName.trim());
    conditions.push({
      $or: [{ "bailers.name": r }, { "bailers.fatherName": r }],
    });
  }

  if (conditions.length === 0) return {};
  if (conditions.length === 1) return conditions[0]!;
  return { $and: conditions };
}

export function filtersToSearchParams(
  filters: CriminalSearchFilters,
  page: number,
  limit: number
): URLSearchParams {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  Object.entries(filters).forEach(([k, v]) => {
    if (v && v !== "all") params.set(k, v);
  });
  return params;
}
