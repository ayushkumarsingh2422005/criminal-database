/**
 * Migrate criminal records: move crimeTypes to history, reshape history fields.
 * Usage: npm run migrate:history
 */
import { readFileSync, existsSync } from "fs";
import { join } from "path";

function loadEnvFile(filename: string) {
  const path = join(process.cwd(), filename);
  if (!existsSync(path)) return;
  const content = readFileSync(path, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

async function main() {
  const { migratePoliceStationReferences } = await import("../lib/police-station-ref");
  const { migrateCriminalHistorySchema } = await import(
    "../lib/migrate-criminal-history-schema"
  );

  console.log("Running police station reference migration...");
  const ps = await migratePoliceStationReferences();
  console.log(`PS refs: ${ps.updated} record(s) updated`);

  console.log("Running criminal history schema migration...");
  const result = await migrateCriminalHistorySchema();
  console.log(
    `History schema: ${result.updated} criminal(s) updated, ${result.historyRows} history row(s) total`
  );
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
