import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import { hashPassword, requireSuperAdmin } from "@/lib/auth";
import { requireAuth, jsonError, jsonOk } from "@/lib/api";
import { Admin, AdminModel } from "@/models/Admin";
import { PoliceStationModel } from "@/models/PoliceStation";

async function policeStationLabel(id?: ObjectId) {
  if (!id) return undefined;
  const station = await PoliceStationModel.findById(id.toString());
  return station?.name;
}

async function sanitizeAdmin(admin: Admin) {
  return {
    id: admin._id!.toString(),
    email: admin.email,
    name: admin.name,
    role: admin.role,
    active: admin.active,
    policeStationId: admin.policeStationId?.toString(),
    policeStationName: await policeStationLabel(admin.policeStationId),
    createdAt: admin.createdAt,
  };
}

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth(request);
    requireSuperAdmin(session);

    const admins = await AdminModel.findAll();
    return jsonOk(await Promise.all(admins.map(sanitizeAdmin)));
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

    let policeStationId: ObjectId | undefined;
    if (role === "admin") {
      const psId = String(body.policeStationId ?? "").trim();
      if (!ObjectId.isValid(psId)) {
        return jsonOk(
          { error: "Police station is required for admin accounts" },
          400
        );
      }
      const station = await PoliceStationModel.findById(psId);
      if (!station?.active) {
        return jsonOk({ error: "Invalid or inactive police station" }, 400);
      }
      policeStationId = new ObjectId(psId);
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
      ...(policeStationId ? { policeStationId } : {}),
      active: true,
      createdAt: now,
      updatedAt: now,
    });

    return jsonOk(await sanitizeAdmin(admin!), 201);
  } catch (error) {
    return jsonError(error);
  }
}
