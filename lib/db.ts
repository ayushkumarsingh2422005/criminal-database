import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGO_URI ?? process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGO_URI or MONGODB_URI must be set in environment");
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const clientPromise =
  global._mongoClientPromise ??
  new MongoClient(uri).connect().then((client) => {
    return client;
  });

if (process.env.NODE_ENV !== "production") {
  global._mongoClientPromise = clientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db("criminal-database");
}

export const COLLECTIONS = {
  admins: "admins",
  criminals: "criminals",
  caseTypes: "case_types",
  policeStations: "police_stations",
  criminalTransfers: "criminal_transfers",
} as const;
