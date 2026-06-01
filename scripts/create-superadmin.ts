/**
 * Create the default superadmin account (or reset its password).
 *
 * Env (optional):
 *   SEED_ADMIN_EMAIL    default: admin@example.com
 *   SEED_ADMIN_PASSWORD default: admin123
 *   SEED_ADMIN_NAME     default: Super Admin
 *
 * Flags:
 *   --reset-password  Update password if the account already exists
 *
 * Usage:
 *   npm run create:superadmin
 *   npm run create:superadmin -- --reset-password
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
  const resetPassword = process.argv.includes("--reset-password");

  const email = (process.env.SEED_ADMIN_EMAIL ?? "admin@example.com")
    .trim()
    .toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD ?? "admin123";
  const name = process.env.SEED_ADMIN_NAME ?? "Super Admin";

  if (!process.env.MONGO_URI && !process.env.MONGODB_URI) {
    throw new Error(
      "MONGO_URI or MONGODB_URI must be set in .env.local or environment"
    );
  }

  if (password.length < 8) {
    throw new Error("SEED_ADMIN_PASSWORD must be at least 8 characters");
  }

  const { hashPassword } = await import("../lib/auth");
  const { AdminModel } = await import("../models/Admin");

  const existing = await AdminModel.findByEmail(email);
  const now = new Date();

  if (!existing) {
    await AdminModel.create({
      email,
      passwordHash: await hashPassword(password),
      name,
      role: "superadmin",
      active: true,
      createdAt: now,
      updatedAt: now,
    });
    console.log(`Created superadmin: ${email}`);
    console.log(`Password: ${password} (change after first login)`);
    process.exit(0);
    return;
  }

  if (existing.role !== "superadmin") {
    console.error(
      `Account ${email} already exists with role "${existing.role}", not superadmin.`
    );
    process.exit(1);
    return;
  }

  if (!resetPassword) {
    console.log(`Superadmin already exists: ${email}`);
    console.log("Use --reset-password to set a new password.");
    process.exit(0);
    return;
  }

  await AdminModel.update(existing._id!.toString(), {
    passwordHash: await hashPassword(password),
    name,
    active: true,
    updatedAt: now,
  });

  console.log(`Updated password for superadmin: ${email}`);
  console.log(`New password: ${password}`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
