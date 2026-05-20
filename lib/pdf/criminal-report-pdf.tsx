import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import { CRIMINAL_FIELDS, photoLabel } from "@/lib/criminal-fields";
import type { PhotoKey } from "@/lib/criminal-fields";
import type { CriminalHistoryRecord, CriminalRecord } from "@/lib/criminal-mapper";
import type { BailerInfo, CriminalVehicle, RelatedPerson } from "@/models/Criminal";
import { dash, formatAddressInline, formatDobDots, formatFirDate } from "./format";

const styles = StyleSheet.create({
  page: {
    paddingTop: 32,
    paddingBottom: 40,
    paddingHorizontal: 36,
    fontFamily: "NotoSansDevanagari",
    fontSize: 9,
    lineHeight: 1.35,
    color: "#111",
  },
  headerLine: { textAlign: "center", fontWeight: 700, fontSize: 10 },
  titleLine: {
    textAlign: "center",
    fontWeight: 700,
    fontSize: 11,
    marginTop: 4,
    marginBottom: 10,
  },
  section: { marginTop: 8, marginBottom: 4 },
  sectionTitle: { fontWeight: 700, fontSize: 10, marginBottom: 4 },
  bodyText: { marginBottom: 3 },
  numbered: { marginBottom: 3, paddingLeft: 8 },
  table: { marginTop: 4, borderWidth: 1, borderColor: "#333" },
  tableRow: { flexDirection: "row", borderBottomWidth: 1, borderColor: "#333" },
  tableRowLast: { flexDirection: "row" },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#4a4a4a",
    borderBottomWidth: 1,
    borderColor: "#333",
  },
  th: {
    padding: 4,
    color: "#fff",
    fontWeight: 700,
    fontSize: 7,
    borderRightWidth: 1,
    borderColor: "#333",
  },
  td: {
    padding: 4,
    fontSize: 7,
    borderRightWidth: 1,
    borderColor: "#333",
  },
  tdSmall: { fontSize: 6.5, color: "#333" },
  cellStack: { marginBottom: 2 },
  zebra: { backgroundColor: "#f5f5f5" },
  photoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    gap: 6,
  },
  photoBox: {
    width: "31%",
    borderWidth: 1,
    borderColor: "#999",
    alignItems: "center",
    padding: 4,
  },
  photoBoxCenter: {
    width: "40%",
    borderWidth: 1,
    borderColor: "#999",
    alignItems: "center",
    padding: 4,
    alignSelf: "center",
    marginTop: 8,
  },
  photoImg: { width: 115, height: 95, objectFit: "contain" },
  photoCaption: { fontSize: 6.5, textAlign: "center", marginTop: 3 },
  footer: { marginTop: 16, alignItems: "flex-end" },
  footerText: { fontSize: 9, textAlign: "right" },
});

function SectionHeading({ children }: { children: string }) {
  return <Text style={styles.sectionTitle}>{String(children)}</Text>;
}

function TableHeader({ widths, labels }: { widths: string[]; labels: string[] }) {
  return (
    <View style={styles.tableHeader}>
      {labels.map((label, i) => (
        <Text key={i} style={[styles.th, { width: widths[i] }]}>
          {label}
        </Text>
      ))}
    </View>
  );
}

function HistorySection({ rows }: { rows: CriminalHistoryRecord[] }) {
  const widths = ["7%", "9%", "24%", "28%", "32%"];
  const headers = [
    "S.No",
    "Case #",
    "FIR No.\nDate of FIR",
    "Section / Act\nPolice Station",
    "Judge Name\nCourt",
  ];

  if (rows.length === 0) {
    return (
      <Text style={styles.bodyText}>कोई आपराधिक इतिहास दर्ज नहीं है।</Text>
    );
  }

  return (
    <View style={styles.table}>
      <TableHeader widths={widths} labels={headers} />
      {rows.map((row, i) => (
        <View
          key={i}
          style={[
            i === rows.length - 1 ? styles.tableRowLast : styles.tableRow,
            i % 2 === 1 ? styles.zebra : {},
          ]}
        >
          <Text style={[styles.td, { width: widths[0] }]}>{row.sNo ?? i + 1}</Text>
          <Text style={[styles.td, { width: widths[1] }]}>{dash(row.caseNumber)}</Text>
          <View style={[styles.td, { width: widths[2] }]}>
            <Text style={styles.cellStack}>{dash(row.firNumber)}</Text>
            <Text style={styles.tdSmall}>{formatFirDate(row.firDate) || "—"}</Text>
          </View>
          <View style={[styles.td, { width: widths[3] }]}>
            <Text style={styles.cellStack}>{dash(row.sectionAct)}</Text>
            <Text style={styles.tdSmall}>{dash(row.policeStation)}</Text>
          </View>
          <View style={[styles.td, { width: widths[4], borderRightWidth: 0 }]}>
            <Text style={styles.cellStack}>{dash(row.judgeName)}</Text>
            <Text style={styles.tdSmall}>{dash(row.court)}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

function SimpleTable({
  widths,
  headers,
  rows,
}: {
  widths: string[];
  headers: string[];
  rows: string[][];
}) {
  if (rows.length === 0) {
    return <Text style={styles.bodyText}>—</Text>;
  }
  return (
    <View style={styles.table}>
      <TableHeader widths={widths} labels={headers} />
      {rows.map((cells, i) => (
        <View
          key={i}
          style={[
            i === rows.length - 1 ? styles.tableRowLast : styles.tableRow,
            i % 2 === 1 ? styles.zebra : {},
          ]}
        >
          {cells.map((cell, j) => (
            <Text
              key={j}
              style={[
                styles.td,
                { width: widths[j], borderRightWidth: j === cells.length - 1 ? 0 : 1 },
              ]}
            >
              {cell}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}

function PhotoBlock({
  src,
  photoKey,
  wide,
}: {
  src: string | null;
  photoKey: PhotoKey;
  wide?: boolean;
}) {
  const hiLabel = photoLabel(photoKey).match(/\(([^)]+)\)/)?.[1] ?? photoKey;

  return (
    <View style={wide ? styles.photoBoxCenter : styles.photoBox}>
      {src ? (
        <Image src={src} style={styles.photoImg} />
      ) : (
        <View style={[styles.photoImg, { backgroundColor: "#eee" }]} />
      )}
      <Text style={styles.photoCaption}>{hiLabel}</Text>
    </View>
  );
}

export function CriminalReportDocument({
  criminal,
  photoSources,
}: {
  criminal: CriminalRecord;
  photoSources: Record<PhotoKey, string | null>;
}) {
  const ps =
    criminal.permanentAddress?.thana ?? criminal.presentAddress?.thana ?? "";
  const district =
    criminal.permanentAddress?.district ?? criminal.presentAddress?.district ?? "";
  const headerPs = ps
    ? `ADDRESS PS- ${ps} थाना${district ? `, ${district}` : ""}।`
    : "ADDRESS PS- —";

  const crimeLine =
    criminal.crimeTypes.length > 0
      ? `${criminal.crimeTypes.join(" / ")} ।`
      : "—";

  const vehicleRows: string[][] = criminal.vehicles.map((v: CriminalVehicle) => [
    dash(v.vehicleNumber),
    dash(v.otherDetails),
    dash(v.remarks),
  ]);

  const relativeRows: string[][] = criminal.closeRelatives.map((r: RelatedPerson) => [
    dash(r.relation),
    dash(r.name),
    dash(r.address),
    dash(r.mobileNumber),
    dash(r.aadhaarNumber),
  ]);

  const gangRows: string[][] = criminal.gangMembers.map((r: RelatedPerson, i) => [
    String(i + 1),
    dash(r.name),
    dash(r.address),
    dash(r.mobileNumber),
    dash(r.aadhaarNumber),
    dash(r.vehicle),
  ]);

  const bailerRows: string[][] = criminal.bailers.map((b: BailerInfo) => [
    dash(b.name),
    dash(b.fatherName),
    dash(b.address),
    dash(b.mobileNumber),
    dash(b.aadhaarNumber),
    dash(b.propertyDetails),
    dash(b.firDetails),
  ]);

  const phys = criminal.physicalDescription;

  return (
    <Document title={`Criminal Report ${criminal.pid}`}>
      <Page size="A4" style={styles.page}>
        <Text style={styles.headerLine}>{headerPs}</Text>
        <Text style={styles.titleLine}>
          सक्रिय अपराधकर्मियों का भौतिक सत्यापन प्रतिवेदन
        </Text>

        <View style={styles.section}>
          <SectionHeading
            children={`1. ${CRIMINAL_FIELDS.crimeTypes.hi} / ${CRIMINAL_FIELDS.crimeTypes.en}:-`}
          />
          <Text style={styles.bodyText}>{crimeLine}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.bodyText}>
            <Text style={{ fontWeight: 700 }}>2. PID नम्बर:- </Text>
            {criminal.pid}
            {"    "}
            <Text style={{ fontWeight: 700 }}>Aadhar No. - </Text>
            {dash(criminal.aadhaarNumber)}
          </Text>
        </View>

        <View style={styles.section}>
          <SectionHeading>3. व्यक्तिगत विवरणी:-</SectionHeading>
          <Text style={styles.numbered}>
            1. नाम:- {dash(criminal.name)}
            {criminal.nameAliases ? ` उर्फ ${criminal.nameAliases}` : ""} जन्म तिथि-{" "}
            {formatDobDots(criminal.dateOfBirth) || "—"} आधार नं०-{" "}
            {dash(criminal.aadhaarNumber)}
            {criminal.aadhaarVerified ? " (सत्यापित)" : ""}
          </Text>
          <Text style={styles.numbered}>
            2. पिता का नाम:- {dash(criminal.fatherName)}
            {criminal.fatherNameAliases ? ` उर्फ ${criminal.fatherNameAliases}` : ""}
          </Text>
          <Text style={styles.numbered}>
            3. मोबाईल नम्बर:- {dash(criminal.mobileNumber)}
          </Text>
          <Text style={styles.numbered}>
            4. स्थायी पता:- {formatAddressInline(criminal.permanentAddress) || "—"}
          </Text>
          <Text style={styles.numbered}>
            5. वर्तमान पता:- {formatAddressInline(criminal.presentAddress) || "—"}
          </Text>
          <Text style={styles.numbered}>
            6. जीविकोपार्जन का वर्तमान साधन:- {dash(criminal.livelihoodMeans)}
          </Text>
          <Text style={styles.numbered}>
            7. जीविकोपार्जन के साधन के सत्यापन की विवरणी:-{" "}
            {dash(criminal.livelihoodVerification)}
          </Text>
        </View>

        <View style={styles.section}>
          <SectionHeading>4. वर्तमान फोटो:-</SectionHeading>
          <View style={styles.photoRow}>
            <PhotoBlock src={photoSources.frontFull} photoKey="frontFull" />
            <PhotoBlock src={photoSources.leftProfile} photoKey="leftProfile" />
            <PhotoBlock src={photoSources.rightProfile} photoKey="rightProfile" />
          </View>
          <PhotoBlock src={photoSources.front} photoKey="front" wide />
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <SectionHeading>5. आपराधिक इतिहास:-</SectionHeading>
          <HistorySection rows={criminal.criminalHistory} />
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <SectionHeading>6. अभियुक्त के वाहन की विवरणी:-</SectionHeading>
          <SimpleTable
            widths={["25%", "50%", "25%"]}
            headers={["गाड़ी नम्बर", "अन्य विवरणी", "अभियुक्ति"]}
            rows={vehicleRows}
          />
        </View>

        <View style={styles.section}>
          <SectionHeading>7. शारीरिक विवरणी:-</SectionHeading>
          <Text style={styles.numbered}>(क) लम्बाई:- {dash(phys?.height)}</Text>
          <Text style={styles.numbered}>(ख) रंग:- {dash(phys?.complexion)}</Text>
          <Text style={styles.numbered}>(ग) गठन:- {dash(phys?.build)}</Text>
          <Text style={styles.numbered}>
            (घ) अन्य पहचान के निशान:- {dash(phys?.identificationMarks)}
          </Text>
          <Text style={styles.numbered}>
            (ङ) विकृति या खासियत यदि कोई हो:- {dash(phys?.deformity)}
          </Text>
        </View>

        <View style={styles.section}>
          <SectionHeading>8. अन्य निकट संबंधियों का विवरणी:-</SectionHeading>
          <SimpleTable
            widths={["14%", "18%", "30%", "18%", "20%"]}
            headers={["रिश्तेदार", "नाम", "पता", "मो०नं०", "आधार नं०"]}
            rows={relativeRows}
          />
        </View>

        <View style={styles.section}>
          <SectionHeading>9. गुट के अन्य सदस्यों की विवरणी:-</SectionHeading>
          <SimpleTable
            widths={["6%", "16%", "24%", "14%", "16%", "24%"]}
            headers={["क्र.", "नाम", "पता", "मो०नं०", "आधार नं०", "गाड़ी/टू-व्हीलर"]}
            rows={gangRows}
          />
        </View>

        <View style={styles.section}>
          <SectionHeading>10. बेलर की विवरणी:-</SectionHeading>
          <SimpleTable
            widths={["12%", "12%", "18%", "10%", "12%", "18%", "18%"]}
            headers={[
              "नाम",
              "पिता",
              "पता",
              "मो०नं०",
              "आ०नं०",
              "जमानत हेतु सम्पत्ति",
              "प्राथमिकी विवरणी",
            ]}
            rows={bailerRows}
          />
        </View>

        <View style={styles.section}>
          <SectionHeading>11. स्वीकारोक्ति बयान:-</SectionHeading>
          <Text style={[styles.bodyText, { minHeight: 40 }]}>
            {dash(criminal.confessionStatement)}
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            सत्यापन की तिथि:- {formatDobDots(criminal.verification?.verificationDate) || "—"}
          </Text>
          <Text style={[styles.footerText, { marginTop: 6 }]}>
            सत्यापन करने वाले पदाधिकारी का नाम / पदनाम:-
          </Text>
          <Text style={[styles.footerText, { marginTop: 4 }]}>
            {dash(criminal.verification?.verifyingOfficer)}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
