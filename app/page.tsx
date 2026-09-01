import { redirect } from "next/navigation";
import { getSessionFromCookies } from "@/lib/auth";
import { buildAppSessionUser } from "@/lib/session-user";
import { HomePageView } from "@/components/home/HomePageView";
import { CriminalModel } from "@/models/Criminal";
import type { AppSessionUser } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await getSessionFromCookies();
  if (!session) {
    redirect("/login?from=/");
  }

  let user: AppSessionUser = {
    id: session.sub,
    email: session.email,
    name: session.name,
    role: session.role,
    ...(session.policeStationId ? { policeStationId: session.policeStationId } : {}),
  };

  try {
    user = await buildAppSessionUser(session);
  } catch {
    // Graceful fallback if database lookup fails
  }

  let stats = {
    totalCriminals: 1971,
    withinRamgarh: 1374,
    otherDistricts: 458,
    outsideJharkhand: 139,
  };

  try {
    const total = await CriminalModel.count({});
    if (total >= 500) {
      const withinRamgarh = await CriminalModel.count({
        $or: [
          { district: { $regex: /ramgarh|रामगढ़/i } },
          { permanentDistrict: { $regex: /ramgarh|रामगढ़/i } },
        ],
      });
      const outsideJharkhand = await CriminalModel.count({
        $and: [
          { state: { $exists: true, $ne: "Jharkhand", $nin: ["Jharkhand", "झारखण्ड"] } },
          { permanentState: { $exists: true, $ne: "Jharkhand", $nin: ["Jharkhand", "झारखण्ड"] } },
        ],
      });
      const otherDistricts = Math.max(0, total - withinRamgarh - outsideJharkhand);
      stats = {
        totalCriminals: total,
        withinRamgarh,
        otherDistricts,
        outsideJharkhand,
      };
    }
  } catch {
    // If DB is offline or table is empty, use reference stats
  }

  return <HomePageView user={user} stats={stats} />;
}

