import path from "path";
import { Font } from "@react-pdf/renderer";

let registered = false;

export function registerPdfFonts() {
  if (registered) return;

  const base = path.join(
    process.cwd(),
    "node_modules/@fontsource/noto-sans-devanagari/files"
  );

  Font.register({
    family: "NotoSansDevanagari",
    fonts: [
      {
        src: path.join(base, "noto-sans-devanagari-devanagari-400-normal.woff"),
        fontWeight: 400,
      },
      {
        src: path.join(base, "noto-sans-devanagari-devanagari-700-normal.woff"),
        fontWeight: 700,
      },
    ],
  });

  registered = true;
}
