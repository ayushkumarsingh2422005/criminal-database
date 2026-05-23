export const EXTENDED_FIELDS = {
  criminalHistory: { en: "Criminal History", hi: "आपराधिक इतिहास" },
  sNo: { en: "S.No.", hi: "क्र." },
  year: { en: "Year", hi: "वर्ष" },
  crimeType: { en: "Crime Type", hi: "अपराध का प्रकार" },
  casePoliceStation: { en: "Case Police Station", hi: "केस पुलिस स्टेशन" },
  firDate: { en: "Date of FIR", hi: "प्राथमिकी की तिथि" },
  sectionAct: { en: "Section / Act", hi: "धारा / अधिनियम" },
  vehicles: { en: "Vehicle Details", hi: "वाहन की विवरणी" },
  vehicleNumber: { en: "Vehicle Number", hi: "गाड़ी नंबर" },
  vehicleOther: { en: "Other Details", hi: "अन्य विवरण" },
  vehicleRemarks: { en: "Remarks", hi: "अभियुक्ति / टिप्पणी" },
  physical: { en: "Physical Description", hi: "शारीरिक विवरण" },
  height: { en: "Height", hi: "लम्बाई" },
  complexion: { en: "Complexion", hi: "रंग" },
  build: { en: "Build", hi: "गठन" },
  identificationMarks: { en: "Identification Marks", hi: "पहचान के निशान" },
  deformity: { en: "Deformity / Specialty", hi: "विकृति या खासियत" },
  closeRelatives: { en: "Close Relatives", hi: "निकट संबंधी" },
  gangMembers: { en: "Gang / Group Members", hi: "गुट के अन्य सदस्य" },
  bailers: { en: "Bailer Details", hi: "बेलर की विवरण" },
  relation: { en: "Relation", hi: "रिश्तेदार" },
  propertyDetails: { en: "Property for Bail", hi: "जमानत हेतु सम्पत्ति" },
  bailerFir: { en: "FIR Details", hi: "प्राथमिकी विवरण" },
  confession: { en: "Confession Statement", hi: "स्वीकारोक्ति बयान" },
  verificationDate: { en: "Verification Date", hi: "सत्यापन की तिथि" },
  verifyingOfficer: { en: "Verifying Officer", hi: "सत्यापन करने वाले पदाधिकारी" },
} as const;

export function extLabel(key: keyof typeof EXTENDED_FIELDS) {
  const f = EXTENDED_FIELDS[key];
  return `${f.en} (${f.hi})`;
}
