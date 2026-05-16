import { NextRequest } from "next/server";
import { hashPassword, requireSuperAdmin } from "@/lib/auth";
import { requireAuth, jsonError, jsonOk } from "@/lib/api";
import { Admin, AdminModel } from "@/models/Admin";

function sanitizeAdmin(admin: Admin) {
  return {
    id: admin._id!.toString(),
    email: admin.email,
    name: admin.name,
    role: admin.role,
    active: admin.active,
    createdAt: admin.createdAt,
  };
}

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth(request);
    requireSuperAdmin(session);

    const admins = await AdminModel.findAll();
    return jsonOk(admins.map(sanitizeAdmin));
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth(request);
    requireSuperAdmin(session);

    const body = await request.json();
    const email = String(body.email ?? "")
      .trim()
      .toLowerCase();
    const name = String(body.name ?? "").trim();
    const password = String(body.password ?? "");
    const role = body.role === "superadmin" ? "superadmin" : "admin";

    if (!email || !name || password.length < 8) {
      return jsonOk(
        { error: "Valid email, name, and password (min 8 chars) required" },
        400
      );
    }

    const existing = await AdminModel.findByEmail(email);
    if (existing) {
      return jsonOk({ error: "Admin with this email already exists" }, 409);
    }

    const now = new Date();
    const admin = await AdminModel.create({
      email,
      name,
      passwordHash: await hashPassword(password),
      role,
      active: true,
      createdAt: now,
      updatedAt: now,
    });

    return jsonOk(sanitizeAdmin(admin!), 201);
  } catch (error) {
    return jsonError(error);
  }
}
