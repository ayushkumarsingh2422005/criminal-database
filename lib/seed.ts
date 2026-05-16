import { hashPassword } from "./auth";
import { AdminModel } from "@/models/Admin";
import { CaseTypeModel } from "@/models/CaseType";
import { PoliceStationModel } from "@/models/PoliceStation";
import { CriminalModel } from "@/models/Criminal";
import { CRIME_TYPE_OPTIONS } from "./criminal-fields";

const DEFAULT_POLICE_STATIONS = [
  "Argora",
  "Rikhiya",
  "Sukhdeonagar",
  "Town",
  "Bariatu",
  "Doranda",
];

export async function ensureSeedData() {
  if ((await AdminModel.count()) === 0) {
    const email = process.env.SEED_ADMIN_EMAIL ?? "admin@example.com";
    const password = process.env.SEED_ADMIN_PASSWORD ?? "admin123";
    const now = new Date();
    await AdminModel.create({
      email: email.toLowerCase(),
      passwordHash: await hashPassword(password),
      name: "Super Admin",
      role: "superadmin",
      active: true,
      createdAt: now,
      updatedAt: now,
    });
  }

  if ((await CaseTypeModel.count()) === 0) {
    await CaseTypeModel.insertMany(
      CRIME_TYPE_OPTIONS.map((c) => ({
        name: c.value,
        active: true,
        createdAt: new Date(),
      }))
    );
  }

  if ((await PoliceStationModel.count()) === 0) {
    await PoliceStationModel.insertMany(
      DEFAULT_POLICE_STATIONS.map((name) => ({
        name,
        active: true,
        createdAt: new Date(),
      }))
    );
  }

  if ((await CriminalModel.count()) === 0) {
    const now = new Date();
    await CriminalModel.create({
      pid: "269517",
      crimeTypes: ["गृह भेदन"],
      name: "धीरज जालान उर्फ धीरज कुमार जालान",
      nameAliases: "धीरज कुमार जालान",
      dateOfBirth: "1984-09-05",
      aadhaarNumber: "631886074969",
      aadhaarVerified: true,
      fatherName: "श्याम जालान उर्फ श्याम सुन्दर जालान",
      mobileNumber: "9297788257",
      permanentAddress: {
        line: "बाबुलाल भिंडी गाड़ी खाना चौक हरमु",
        thana: "सुखदेवनगर",
        district: "राँची",
      },
      presentAddress: {
        line: "बाबुलाल भिंडी गाड़ी खाना चौक हरमु",
        thana: "सुखदेवनगर",
        district: "राँची",
      },
      livelihoodMeans:
        "पिता के कपड़ा दुकान में काम करने की बात धीरज जालान के द्वारा बताया गया है।",
      livelihoodVerification: "पिता के द्वारा समर्थन किया गया है।",
      photos: {},
      criminalHistory: [
        {
          sNo: 1,
          caseNumber: "32",
          firNumber: "GR-1738/15 PS-249/15",
          firDate: "2023-03-18",
          sectionAct: "P/W",
          policeStation: "KOTWALI(P)",
          judgeName: "CJM RANCHI",
          court: "RANCHI CIVIL COURT",
        },
        {
          sNo: 2,
          caseNumber: "30",
          firNumber: "GONDA-137/22",
          firDate: "2022-12-20",
          sectionAct: "379 IPC",
          policeStation: "GONDA",
          judgeName: "ASHOK KUMAR JMFC-XXI RANCHI",
          court: "RANCHI CIVIL COURT",
        },
      ],
      vehicles: [
        {
          vehicleNumber: "JH01CT1105 (Bullet)",
          otherDetails: "In the name of father Shyam Sundar Jalan",
          remarks: "",
        },
      ],
      physicalDescription: {
        height: "05 feet 10 inch approx",
        complexion: "Wheaten/Fair",
        build: "Strong/Sturdy",
        identificationMarks:
          "1. CUT MARK ON RIGHT EYEBROW\n2. MOLE UP SIDE RIGHT ARM",
        deformity: "",
      },
      closeRelatives: [],
      gangMembers: [],
      bailers: [],
      confessionStatement: "",
      verification: {
        verificationDate: "",
        verifyingOfficer: "",
      },
      createdAt: now,
      updatedAt: now,
    });
  }
}
