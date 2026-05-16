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

    const token = await createSessionToken({
      sub: admin._id!.toString(),
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });

    const response = jsonOk({
      user: {
        id: admin._id!.toString(),
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
    response.cookies.set(COOKIE_NAME, token, sessionCookieOptions());
    return response;
  } catch (error) {
    return jsonError(error);
  }
}
