import { NextRequest } from "next/server";
import { requireAuth, jsonError, jsonOk } from "@/lib/api";
import { AuthError } from "@/lib/auth";
import { AppSettingsModel } from "@/models/AppSettings";
import { isSuperAdmin } from "@/lib/admin-scope";

export async function GET(request: NextRequest) {
  try {
    await requireAuth(request);
    const settings = await AppSettingsModel.get();
    return jsonOk({
      verificationFrequencyDays: settings.verificationFrequencyDays,
    });
  } catch (error) {
    return jsonError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await requireAuth(request);
    if (!isSuperAdmin(session)) {
      throw new AuthError("Superadmin only", 403);
    }

    const body = (await request.json()) as { verificationFrequencyDays?: number };
    const days = Number(body.verificationFrequencyDays);
    if (!Number.isFinite(days) || days < 1 || days > 365) {
      return jsonOk({ error: "Frequency must be between 1 and 365 days" }, 400);
    }

    const settings = await AppSettingsModel.setVerificationFrequencyDays(
      Math.round(days),
      session.sub
    );
    return jsonOk({
      verificationFrequencyDays: settings.verificationFrequencyDays,
    });
  } catch (error) {
    return jsonError(error);
  }
}
