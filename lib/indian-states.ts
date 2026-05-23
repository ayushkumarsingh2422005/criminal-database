/** Indian states and union territories — value stored in DB (English name). */

export const DEFAULT_STATE = "Jharkhand";

export const INDIA_STATES_AND_UTS = [
  { value: "Andhra Pradesh", labelHi: "आंध्र प्रदेश" },
  { value: "Arunachal Pradesh", labelHi: "अरुणाचल प्रदेश" },
  { value: "Assam", labelHi: "असम" },
  { value: "Bihar", labelHi: "बिहार" },
  { value: "Chhattisgarh", labelHi: "छत्तीसगढ़" },
  { value: "Goa", labelHi: "गोआ" },
  { value: "Gujarat", labelHi: "गुजरात" },
  { value: "Haryana", labelHi: "हरियाणा" },
  { value: "Himachal Pradesh", labelHi: "हिमाचल प्रदेश" },
  { value: "Jharkhand", labelHi: "झारखंड" },
  { value: "Karnataka", labelHi: "कर्नाटक" },
  { value: "Kerala", labelHi: "केरल" },
  { value: "Madhya Pradesh", labelHi: "मध्य प्रदेश" },
  { value: "Maharashtra", labelHi: "महाराष्ट्र" },
  { value: "Manipur", labelHi: "मणिपुर" },
  { value: "Meghalaya", labelHi: "मेघालय" },
  { value: "Mizoram", labelHi: "मिजोरम" },
  { value: "Nagaland", labelHi: "नागालैंड" },
  { value: "Odisha", labelHi: "ओडिशा" },
  { value: "Punjab", labelHi: "पंजाब" },
  { value: "Rajasthan", labelHi: "राजस्थान" },
  { value: "Sikkim", labelHi: "सिक्किम" },
  { value: "Tamil Nadu", labelHi: "तमिल नाडु" },
  { value: "Telangana", labelHi: "तेलंगाना" },
  { value: "Tripura", labelHi: "त्रिपुरा" },
  { value: "Uttar Pradesh", labelHi: "उत्तर प्रदेश" },
  { value: "Uttarakhand", labelHi: "उत्तराखंड" },
  { value: "West Bengal", labelHi: "पश्चिम बंगाल" },
  { value: "Andaman and Nicobar Islands", labelHi: "अंडमान और निकोबार द्वीप समूह" },
  { value: "Chandigarh", labelHi: "चंडीगढ़" },
  {
    value: "Dadra and Nagar Haveli and Daman and Diu",
    labelHi: "दादरा और नगर हवेली और दमन और दीव",
  },
  { value: "Delhi", labelHi: "दिल्ली" },
  { value: "Jammu and Kashmir", labelHi: "जम्मू और कश्मीर" },
  { value: "Ladakh", labelHi: "लदाख" },
  { value: "Lakshadweep", labelHi: "लक्षद्वीप" },
  { value: "Puducherry", labelHi: "पुदुचेरी" },
] as const;

export function stateOptionLabel(entry: (typeof INDIA_STATES_AND_UTS)[number]): string {
  return `${entry.value} (${entry.labelHi})`;
}

export function stateSelectOptions(): { value: string; label: string }[] {
  return INDIA_STATES_AND_UTS.map((s) => ({
    value: s.value,
    label: stateOptionLabel(s),
  }));
}

export function normalizeStateValue(value?: string): string {
  if (!value?.trim()) return DEFAULT_STATE;
  const trimmed = value.trim();
  const exact = INDIA_STATES_AND_UTS.find((s) => s.value === trimmed);
  if (exact) return exact.value;
  const lower = trimmed.toLowerCase();
  const byEn = INDIA_STATES_AND_UTS.find((s) => s.value.toLowerCase() === lower);
  if (byEn) return byEn.value;
  const byHi = INDIA_STATES_AND_UTS.find((s) => s.labelHi === trimmed);
  if (byHi) return byHi.value;
  return trimmed;
}

export function resolveAddressState(value?: string): string {
  return normalizeStateValue(value || DEFAULT_STATE);
}
