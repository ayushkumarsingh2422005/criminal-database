import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";
import { readFileSync } from "fs";

const env = readFileSync(".env.local", "utf8");
const uri = env.match(/^MONGO_URI=(.+)$/m)?.[1]?.trim();
if (!uri) throw new Error("MONGO_URI not found");

const password = process.argv[2] ?? "admin123";
const client = await MongoClient.connect(uri);
const db = client.db("criminal-database");
const hash = await bcrypt.hash(password, 12);
await db
  .collection("admins")
  .updateOne({ email: "admin@example.com" }, { $set: { passwordHash: hash } });
console.log(`Password reset for admin@example.com to: ${password}`);
await client.close();
