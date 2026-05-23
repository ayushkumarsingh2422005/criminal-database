import { ObjectId, type Collection } from "mongodb";
import { getDb, COLLECTIONS } from "@/lib/db";

export const SETTINGS_DOC_ID = "global";

export interface AppSettings {
  _id: string;
  verificationFrequencyDays: number;
  updatedAt: Date;
  updatedBy?: string;
}

export const DEFAULT_VERIFICATION_FREQUENCY_DAYS = 30;

export async function getAppSettingsCollection(): Promise<Collection<AppSettings>> {
  const db = await getDb();
  return db.collection<AppSettings>(COLLECTIONS.appSettings);
}

export const AppSettingsModel = {
  async get(): Promise<AppSettings> {
    const col = await getAppSettingsCollection();
    const doc = await col.findOne({ _id: SETTINGS_DOC_ID });
    if (doc) return doc;
    const now = new Date();
    const defaults: AppSettings = {
      _id: SETTINGS_DOC_ID,
      verificationFrequencyDays: DEFAULT_VERIFICATION_FREQUENCY_DAYS,
      updatedAt: now,
    };
    await col.insertOne(defaults);
    return defaults;
  },

  async setVerificationFrequencyDays(days: number, updatedBy: string) {
    const col = await getAppSettingsCollection();
    const now = new Date();
    await col.updateOne(
      { _id: SETTINGS_DOC_ID },
      {
        $set: {
          verificationFrequencyDays: days,
          updatedAt: now,
          updatedBy,
        },
        $setOnInsert: { _id: SETTINGS_DOC_ID },
      },
      { upsert: true }
    );
    return this.get();
  },
};
