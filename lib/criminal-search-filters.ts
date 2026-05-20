/** Client-safe search filter types and URL helpers (no MongoDB). */

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
