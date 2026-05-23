import "server-only";

import { ObjectId } from "mongodb";
import type { Filter } from "mongodb";
import type { Criminal } from "@/models/Criminal";
import { PoliceStationModel } from "@/models/PoliceStation";
import type { CriminalSearchFilters } from "@/lib/criminal-search-filters";
import {
  buildPoliceStationScopeFilter,
  mergeCriminalFilters,
} from "@/lib/admin-scope";

function regex(value: string) {
  return { $regex: value, $options: "i" as const };
}

function pushRegex(conditions: Filter<Criminal>[], field: string, value: string | null) {
  if (!value?.trim()) return;
  conditions.push({ [field]: regex(value.trim()) } as Filter<Criminal>);
}

async function resolvePoliceStationObjectId(
  value: string | null
): Promise<ObjectId | null> {
  if (!value?.trim()) return null;
  const trimmed = value.trim();
  if (ObjectId.isValid(trimmed)) return new ObjectId(trimmed);
  const station = await PoliceStationModel.findByNameInsensitive(trimmed);
  return station?._id ?? null;
}

export async function buildCriminalFilter(
  params: URLSearchParams | CriminalSearchFilters,
  scopePoliceStationId?: ObjectId | null
): Promise<Filter<Criminal>> {
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

  const historyCrimeType = get("historyCrimeType");
  if (historyCrimeType && historyCrimeType !== "all") {
    conditions.push({ "criminalHistory.crimeType": historyCrimeType });
  }

  pushRegex(conditions, "criminalHistory.year", get("historyYear"));

  const district = get("district");
  if (district?.trim()) {
    conditions.push({
      $or: [
        { "permanentAddress.district": district.trim() },
        { "presentAddress.district": district.trim() },
      ],
    });
  }

  const addressPsId = await resolvePoliceStationObjectId(
    get("addressPoliceStation") ?? (params instanceof URLSearchParams ? params.get("thana") : null)
  );
  if (addressPsId) {
    const addressType = get("addressType") || "any";
    if (addressType === "permanent") {
      conditions.push({ "permanentAddress.policeStationId": addressPsId });
    } else if (addressType === "present") {
      conditions.push({ "presentAddress.policeStationId": addressPsId });
    } else {
      conditions.push({
        $or: [
          { "permanentAddress.policeStationId": addressPsId },
          { "presentAddress.policeStationId": addressPsId },
        ],
      });
    }
  }

  pushRegex(conditions, "criminalHistory.sectionAct", get("sectionAct"));

  const historyPsId = await resolvePoliceStationObjectId(get("historyCasePS"));
  if (historyPsId) {
    conditions.push({
      $or: [
        { "criminalHistory.casePoliceStationId": historyPsId },
        { "criminalHistory.policeStationId": historyPsId },
      ],
    });
  }

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

  let filter: Filter<Criminal> = {};
  if (conditions.length === 1) filter = conditions[0]!;
  else if (conditions.length > 1) filter = { $and: conditions };

  if (scopePoliceStationId) {
    filter = mergeCriminalFilters(
      filter,
      buildPoliceStationScopeFilter(scopePoliceStationId)
    );
  }

  return filter;
}
