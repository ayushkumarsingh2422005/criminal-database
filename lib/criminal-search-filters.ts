/** Client-safe search filter types and URL helpers (no MongoDB). */

export interface CriminalSearchFilters {
  name: string;
  pid: string;
  mobileNumber: string;
  fatherName: string;
  district: string;
  /** Permanent or present address police station ID */
  addressPoliceStation: string;
  /** Which address to match: any, permanent, or present */
  addressType: string;
  aadhaarNumber: string;
  /** Crime type on a criminal history row */
  historyCrimeType: string;
  historyYear: string;
  historyCasePS: string;
  sectionAct: string;
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
  fatherName: "",
  district: "",
  addressPoliceStation: "",
  addressType: "any",
  aadhaarNumber: "",
  historyCrimeType: "all",
  historyYear: "",
  historyCasePS: "",
  sectionAct: "",
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
    if (v && v !== "all" && v !== "any") params.set(k, v);
  });
  return params;
}
