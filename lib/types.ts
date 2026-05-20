/** Shared app types (not MongoDB document models — see /models for those). */
export type { AdminRole } from "@/models/Admin";

export interface SessionPayload {
  sub: string;
  email: string;
  name: string;
  role: "superadmin" | "admin";
  /** Set for PS-scoped admins (included in JWT). */
  policeStationId?: string;
}

export type AppSessionUser = {
  id: string;
  email: string;
  name: string;
  role: "superadmin" | "admin";
  policeStationId?: string;
  policeStationName?: string;
};
