/** Bilingual field labels: English (Hindi) for admin UI */

export const CRIME_TYPE_OPTIONS = [
  { value: "सम्पर्क मूलक", labelEn: "Contact-related", labelHi: "सम्पर्क मूलक" },
  { value: "अम्ल", labelEn: "Acid attack", labelHi: "अम्ल" },
  { value: "गृह भेदन", labelEn: "House breaking", labelHi: "गृह भेदन" },
  { value: "लूट", labelEn: "Robbery / Loot", labelHi: "लूट" },
  { value: "चैन छिनतई", labelEn: "Chain snatching", labelHi: "चैन छिनतई" },
  { value: "डकैती", labelEn: "Dacoity", labelHi: "डकैती" },
  {
    value: "छिरौती के लिए अपहरण",
    labelEn: "Kidnapping for ransom",
    labelHi: "छिरौती के लिए अपहरण",
  },
  { value: "NDPS", labelEn: "NDPS", labelHi: "एनडीपीएस" },
  { value: "वाहन चोरी", labelEn: "Vehicle theft", labelHi: "वाहन चोरी" },
  { value: "अन्य चोरी", labelEn: "Other theft", labelHi: "अन्य चोरी" },
] as const;

export const CRIMINAL_FIELDS = {
  crimeTypes: {
    en: "Crime Type / Style",
    hi: "अपराध शैली / अपराध के प्रकार",
  },
  pid: { en: "PID Number", hi: "PID नंबर" },
  name: { en: "Name", hi: "नाम" },
  nameAliases: { en: "Aliases", hi: "उर्फ / अन्य नाम" },
  dateOfBirth: { en: "Date of Birth", hi: "जन्म तिथि" },
  aadhaarNumber: { en: "Aadhaar Number", hi: "आधार नंबर" },
  aadhaarVerified: { en: "Aadhaar Verified", hi: "आधार सत्यापित" },
  fatherName: { en: "Father's Name", hi: "पिता का नाम" },
  fatherNameAliases: { en: "Father's Aliases", hi: "पिता उर्फ" },
  mobileNumber: { en: "Mobile Number", hi: "मोबाइल नंबर" },
  permanentAddress: { en: "Permanent Address", hi: "स्थायी पता" },
  presentAddress: { en: "Present Address", hi: "वर्तमान पता" },
  casePS: { en: "Case PS (Police Station)", hi: "केस पुलिस स्टेशन / थाना" },
  thana: { en: "Police Station (PS)", hi: "पुलिस स्टेशन / थाना" },
  district: { en: "District (Zilla)", hi: "जिला" },
  livelihoodMeans: {
    en: "Current Livelihood / Occupation",
    hi: "जीविकोपाजन का वर्तमान साधन",
  },
  livelihoodVerification: {
    en: "Livelihood Verification Process",
    hi: "जीविकोपाजन के साधन के सत्यापन की प्रक्रिया",
  },
  photos: { en: "Photographs", hi: "विभिन्न फोटो" },
  photoFrontFull: {
    en: "Front Full-Size Photo",
    hi: "सामने से लिया गया फुल साइज फोटो",
  },
  photoLeftProfile: { en: "Left Profile Photo", hi: "बायां प्रोफाइल फोटो" },
  photoRightProfile: { en: "Right Profile Photo", hi: "दायां प्रोफाइल फोटो" },
  photoFront: { en: "Front Photo", hi: "सामने से लिया गया फोटो" },
} as const;

export function fieldLabel(key: keyof typeof CRIMINAL_FIELDS): string {
  const f = CRIMINAL_FIELDS[key];
  return `${f.en} (${f.hi})`;
}

export const PHOTO_KEYS = [
  "frontFull",
  "leftProfile",
  "rightProfile",
  "front",
] as const;

export type PhotoKey = (typeof PHOTO_KEYS)[number];

export function photoLabel(key: PhotoKey): string {
  const map: Record<PhotoKey, keyof typeof CRIMINAL_FIELDS> = {
    frontFull: "photoFrontFull",
    leftProfile: "photoLeftProfile",
    rightProfile: "photoRightProfile",
    front: "photoFront",
  };
  return fieldLabel(map[key]);
}
