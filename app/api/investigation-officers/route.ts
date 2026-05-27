import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import { hashPassword, canManageInvestigationOfficers } from "@/lib/auth";
import { requireAuth, jsonError, jsonOk } from "@/lib/api";
import { Admin, AdminModel } from "@/models/Admin";
import { PoliceStationModel } from "@/models/PoliceStation";
import { getScopedPoliceStationId } from "@/lib/admin-scope";
import { AuthError } from "@/lib/auth";

async function policeStationLabel(id?: ObjectId) {
  if (!id) return undefined;
  const station = await PoliceStationModel.findById(id.toString());
  return station?.name;
}

async function sanitizeIo(admin: Admin) {
  return {
    id: admin._id!.toString(),
    email: admin.email,
    name: admin.name,
    role: "io" as const,
    active: admin.active,
    policeStationId: admin.policeStationId?.toString(),
    policeStationName: await policeStationLabel(admin.policeStationId),
    createdAt: admin.createdAt,
  };
}

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth(request);
    if (!canManageInvestigationOfficers(session)) {
      throw new AuthError("Access denied", 403);
    }

    const { searchParams } = new URL(request.url);
    let psFilter: ObjectId | undefined;

    const scopedPs = await getScopedPoliceStationId(session);
    if (scopedPs) {
      psFilter = scopedPs;
    } else {
      const queryPs = searchParams.get("policeStationId")?.trim();
      if (queryPs && ObjectId.isValid(queryPs)) {
        psFilter = new ObjectId(queryPs);
      }
    }

    const ios = await AdminModel.findInvestigationOfficers(psFilter);
    return jsonOk(await Promise.all(ios.map(sanitizeIo)));
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth(request);
    if (!canManageInvestigationOfficers(session)) {
      throw new AuthError("Access denied", 403);
    }

    const body = await request.json();
    const email = String(body.email ?? "")
      .trim()
      .toLowerCase();
    const name = String(body.name ?? "").trim();
    const password = String(body.password ?? "");

    if (!email || !name || password.length < 8) {
      return jsonOk(
        { error: "Valid email, name, and password (min 8 chars) required" },
        400
      );
    }

    let policeStationId: ObjectId;
    const scopedPs = await getScopedPoliceStationId(session);
    if (scopedPs) {
      policeStationId = scopedPs;
    } else {
      const psId = String(body.policeStationId ?? "").trim();
      if (!ObjectId.isValid(psId)) {
        return jsonOk({ error: "Police station is required" }, 400);
      }
      const station = await PoliceStationModel.findById(psId);
      if (!station?.active) {
        return jsonOk({ error: "Invalid or inactive police station" }, 400);
      }
      policeStationId = new ObjectId(psId);
    }

    const existing = await AdminModel.findByEmail(email);
    if (existing) {
      return jsonOk({ error: "User with this email already exists" }, 409);
    }

    const now = new Date();
    const admin = await AdminModel.create({
      email,
      name,
      passwordHash: await hashPassword(password),
      role: "io",
      policeStationId,
      active: true,
      createdAt: now,
      updatedAt: now,
    });

    return jsonOk(await sanitizeIo(admin!), 201);
  } catch (error) {
    return jsonError(error);
  }
}
