import { NextRequest } from "next/server";
import {
  verifyPassword,
  createSessionToken,
  sessionCookieOptions,
  COOKIE_NAME,
} from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/api";
import { ensureSeedData } from "@/lib/seed";
import { AdminModel } from "@/models/Admin";
import { PoliceStationModel } from "@/models/PoliceStation";

export async function POST(request: NextRequest) {
  try {
    await ensureSeedData();
    const body = await request.json();
    const email = String(body.email ?? "")
      .trim()
      .toLowerCase();
    const password = String(body.password ?? "");

    if (!email || !password) {
      return jsonOk({ error: "Email and password are required" }, 400);
    }

    const admin = await AdminModel.findActiveByEmail(email);

    if (!admin) {
      return jsonOk({ error: "Invalid email or password" }, 401);
    }

    if (admin.role === "admin" && !admin.policeStationId) {
      return jsonOk(
        {
          error:
            "This admin account has no police station assigned. Contact superadmin.",
        },
        403
      );
    }

    const isMobileApp =
      request.headers.get("x-client-app") === "criminal-database-mobile";
    if (isMobileApp && admin.role === "superadmin") {
      return jsonOk(
        {
          error:
            "Superadmin access is only available on the web application. Please sign in using the web portal.",
        },
        403
      );
    }

    const valid = await verifyPassword(password, admin.passwordHash);
    if (!valid) {
      return jsonOk(
        {
          error:
            "Invalid email or password. Default is admin@example.com / admin123 (case-sensitive).",
        },
        401
      );
    }

    const policeStationId = admin.policeStationId?.toString();

    const token = await createSessionToken({
      sub: admin._id!.toString(),
      email: admin.email,
      name: admin.name,
      role: admin.role,
      ...(policeStationId ? { policeStationId } : {}),
    });

    let policeStationName: string | undefined;
    if (policeStationId) {
      const station = await PoliceStationModel.findById(policeStationId);
      policeStationName = station?.name;
    }

    const response = jsonOk({
      user: {
        id: admin._id!.toString(),
        email: admin.email,
        name: admin.name,
        role: admin.role,
        ...(policeStationId ? { policeStationId } : {}),
        ...(policeStationName ? { policeStationName } : {}),
      },
      token,
    });
    response.cookies.set(COOKIE_NAME, token, sessionCookieOptions());
    return response;
  } catch (error) {
    return jsonError(error);
  }
}
