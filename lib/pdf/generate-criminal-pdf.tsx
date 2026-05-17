import { renderToBuffer } from "@react-pdf/renderer";
import type { CriminalRecord } from "@/lib/criminal-mapper";
import { CriminalReportDocument } from "./criminal-report-pdf";
import { resolvePhotoSources } from "./load-photos";
import { registerPdfFonts } from "./register-font";

export async function generateCriminalPdf(
  criminal: CriminalRecord
): Promise<Buffer> {
  registerPdfFonts();
  const photoSources = resolvePhotoSources(criminal.photos, criminal.pid);
  const buffer = await renderToBuffer(
    <CriminalReportDocument criminal={criminal} photoSources={photoSources} />
  );
  return Buffer.from(buffer);
}
