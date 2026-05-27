import "server-only";

import { PoliceStationModel } from "@/models/PoliceStation";
import { AdminModel } from "@/models/Admin";
import type { SessionPayload, AppSessionUser } from "@/lib/types";

export async function buildAppSessionUser(
  session: SessionPayload
): Promise<AppSessionUser> {
  let policeStationId = session.policeStationId;
  let policeStationName: string | undefined;

  if (session.role === "admin" || session.role === "io") {
    if (!policeStationId) {
      const admin = await AdminModel.findById(session.sub);
      policeStationId = admin?.policeStationId?.toString();
    }
    if (policeStationId) {
      const station = await PoliceStationModel.findById(policeStationId);
      policeStationName = station?.name;
    }
  }

  return {
    id: session.sub,
    email: session.email,
    name: session.name,
    role: session.role,
    ...(policeStationId ? { policeStationId } : {}),
    ...(policeStationName ? { policeStationName } : {}),
  };
}
