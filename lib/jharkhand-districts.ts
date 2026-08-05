/** All 24 districts of Jharkhand — value stored in DB (Hindi name). */

export const JHARKHAND_DISTRICTS = [
  { value: "बोकारो", labelEn: "Bokaro", labelHi: "बोकारो" },
  { value: "चतरा", labelEn: "Chatra", labelHi: "चतरा" },
  { value: "देवघर", labelEn: "Deoghar", labelHi: "देवघर" },
  { value: "धनबाद", labelEn: "Dhanbad", labelHi: "धनबाद" },
  { value: "दुमका", labelEn: "Dumka", labelHi: "दुमका" },
  { value: "पूर्वी सिंहभूम", labelEn: "East Singhbhum", labelHi: "पूर्वी सिंहभूम" },
  { value: "गढ़वा", labelEn: "Garhwa", labelHi: "गढ़वा" },
  { value: "गिरिडीह", labelEn: "Giridih", labelHi: "गिरिडीह" },
  { value: "गोड्डा", labelEn: "Godda", labelHi: "गोड्डा" },
  { value: "गुमला", labelEn: "Gumla", labelHi: "गुमला" },
  { value: "हजारीबाग", labelEn: "Hazaribagh", labelHi: "हजारीबाग" },
  { value: "जामताड़ा", labelEn: "Jamtara", labelHi: "जामताड़ा" },
  { value: "खूंटी", labelEn: "Khunti", labelHi: "खूंटी" },
  { value: "कोडरमा", labelEn: "Koderma", labelHi: "कोडरमा" },
  { value: "लातेहार", labelEn: "Latehar", labelHi: "लातेहार" },
  { value: "लोहरदगा", labelEn: "Lohardaga", labelHi: "लोहरदगा" },
  { value: "पाकुड़", labelEn: "Pakur", labelHi: "पाकुड़" },
  { value: "पलामू", labelEn: "Palamu", labelHi: "पलामू" },
  { value: "रामगढ़", labelEn: "Ramgarh", labelHi: "रामगढ़" },
  { value: "राँची", labelEn: "Ranchi", labelHi: "राँची" },
  { value: "साहिबगंज", labelEn: "Sahibganj", labelHi: "साहिबगंज" },
  { value: "सराइकेला खरसावाँ", labelEn: "Saraikela Kharsawan", labelHi: "सराइकेला खरसावाँ" },
  { value: "सिमडेगा", labelEn: "Simdega", labelHi: "सिमडेगा" },
  { value: "पश्चिमी सिंहभूम", labelEn: "West Singhbhum", labelHi: "पश्चिमी सिंहभूम" },
] as const;

/** Select value when district is not in the Jharkhand list — actual name stored separately. */
export const OTHER_DISTRICT_VALUE = "__other__";

export type JharkhandDistrictValue = (typeof JHARKHAND_DISTRICTS)[number]["value"];

export function isJharkhandDistrictValue(value?: string): boolean {
  if (!value?.trim()) return false;
  return JHARKHAND_DISTRICTS.some((d) => d.value === value.trim());
}

export function districtOptionLabel(d: (typeof JHARKHAND_DISTRICTS)[number]): string {
  return `${d.labelEn} (${d.labelHi})`;
}

export function districtSelectOptions(emptyLabel?: string): { value: string; label: string }[] {
  const options = JHARKHAND_DISTRICTS.map((d) => ({
    value: d.value,
    label: districtOptionLabel(d),
  }));
  const other = {
    value: OTHER_DISTRICT_VALUE,
    label: "Other / अन्य (enter manually)",
  };
  if (emptyLabel) {
    return [{ value: "", label: emptyLabel }, ...options, other];
  }
  return [{ value: "", label: "Select district / जिला चुनें" }, ...options, other];
}

/** Match stored district text to a predefined Jharkhand option (legacy free-text values). */
export function normalizeDistrictValue(value?: string): string {
  if (!value?.trim()) return "";
  const trimmed = value.trim();
  const exact = JHARKHAND_DISTRICTS.find((d) => d.value === trimmed);
  if (exact) return exact.value;
  const lower = trimmed.toLowerCase();
  const byEn = JHARKHAND_DISTRICTS.find((d) => d.labelEn.toLowerCase() === lower);
  if (byEn) return byEn.value;
  return trimmed;
}

/** Split stored DB value into select + optional custom field for forms. */
export function splitDistrictForForm(stored?: string): {
  districtSelect: string;
  districtCustom: string;
} {
  if (!stored?.trim()) {
    return { districtSelect: "", districtCustom: "" };
  }
  const normalized = normalizeDistrictValue(stored);
  if (isJharkhandDistrictValue(normalized)) {
    return { districtSelect: normalized, districtCustom: "" };
  }
  return { districtSelect: OTHER_DISTRICT_VALUE, districtCustom: stored.trim() };
}

/** Value to persist on save from form select + custom input. */
export function resolveDistrictForSave(
  districtSelect: string,
  districtCustom: string
): string {
  if (districtSelect === OTHER_DISTRICT_VALUE) {
    return districtCustom.trim();
  }
  return districtSelect.trim();
}

export function districtDisplayLabel(stored?: string): string {
  if (!stored?.trim()) return "";
  const normalized = normalizeDistrictValue(stored);
  if (isJharkhandDistrictValue(normalized)) {
    const row = JHARKHAND_DISTRICTS.find((d) => d.value === normalized);
    return row ? districtOptionLabel(row) : normalized;
  }
  return stored.trim();
}
