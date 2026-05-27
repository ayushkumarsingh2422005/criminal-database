import "server-only";

import { ObjectId } from "mongodb";
import type { Criminal } from "@/models/Criminal";
import { CriminalModel, getCriminalCollection } from "@/models/Criminal";
import { CriminalTransferModel } from "@/models/CriminalTransfer";
import { PoliceStationModel } from "@/models/PoliceStation";
import { AdminModel } from "@/models/Admin";
import { AuthError, isIo } from "@/lib/auth";
import type { SessionPayload } from "@/lib/types";
import {
  applyScopedAdminWrite,
  assertCriminalAccess,
  criminalBelongsToPoliceStation,
  getScopedPoliceStationId,
  isSuperAdmin,
} from "@/lib/admin-scope";
import { toCriminalRecord } from "@/lib/criminal-mapper";
import { enrichCriminalRecord, loadPoliceStationNameMap } from "@/lib/police-station-ref";

export function requireTransferAdmin(session: SessionPayload): void {
  if (isSuperAdmin(session)) {
    throw new AuthError("Transfer is only available for police station admins", 403);
  }
  if (isIo(session)) {
    throw new AuthError("Investigation officers cannot access transfers", 403);
  }
  if (session.role !== "admin") {
    throw new AuthError("Police station admin access required", 403);
  }
}

export async function requireTransferPoliceStationId(
  session: SessionPayload
): Promise<ObjectId> {
  requireTransferAdmin(session);
  const psId = await getScopedPoliceStationId(session);
  if (!psId) {
    throw new AuthError("Police station assignment required", 403);
  }
  return psId;
}

export type TransferListItem = {
  id: string;
  status: string;
  message?: string;
  createdAt: Date;
  respondedAt?: Date;
  criminalId: string;
  criminalPid: string;
  criminalName: string;
  fromPoliceStationId: string;
  fromPoliceStationName: string;
  toPoliceStationId: string;
  toPoliceStationName: string;
  requestedByName: string;
  respondedByName?: string;
};

async function enrichTransfer(
  transfer: NonNullable<Awaited<ReturnType<typeof CriminalTransferModel.findById>>>,
  criminal?: Criminal | null
): Promise<TransferListItem | null> {
  if (!transfer._id) return null;

  const c =
    criminal ??
    (await CriminalModel.findById(transfer.criminalId.toString()));
  if (!c) return null;

  const [fromPs, toPs, requester, responder] = await Promise.all([
    PoliceStationModel.findById(transfer.fromPoliceStationId.toString()),
    PoliceStationModel.findById(transfer.toPoliceStationId.toString()),
    AdminModel.findById(transfer.requestedByAdminId.toString()),
    transfer.respondedByAdminId
      ? AdminModel.findById(transfer.respondedByAdminId.toString())
      : null,
  ]);

  const map = await loadPoliceStationNameMap([c]);
  const record = enrichCriminalRecord(toCriminalRecord(c), map);

  return {
    id: transfer._id.toString(),
    status: transfer.status,
    message: transfer.message,
    createdAt: transfer.createdAt,
    respondedAt: transfer.respondedAt,
    criminalId: transfer.criminalId.toString(),
    criminalPid: record.pid,
    criminalName: record.name,
    fromPoliceStationId: transfer.fromPoliceStationId.toString(),
    fromPoliceStationName: fromPs?.name ?? "—",
    toPoliceStationId: transfer.toPoliceStationId.toString(),
    toPoliceStationName: toPs?.name ?? "—",
    requestedByName: requester?.name ?? "—",
    respondedByName: responder?.name,
  };
}

export async function listTransfersForSession(session: SessionPayload) {
  const psId = await requireTransferPoliceStationId(session);
  const { outgoing, incoming } =
    await CriminalTransferModel.findByPoliceStation(psId);

  const criminalIds = [
    ...new Set(
      [...outgoing, ...incoming].map((t) => t.criminalId.toString())
    ),
  ];
  const criminals = await Promise.all(
    criminalIds.map((id) => CriminalModel.findById(id))
  );
  const criminalMap = new Map<string, Criminal>();
  for (const c of criminals) {
    if (c?._id) criminalMap.set(c._id.toString(), c);
  }

  const enrichList = async (rows: typeof outgoing) => {
    const items = await Promise.all(
      rows.map((t) => enrichTransfer(t, criminalMap.get(t.criminalId.toString())))
    );
    return items.filter((x): x is TransferListItem => x !== null);
  };

  return {
    outgoing: await enrichList(outgoing),
    incoming: await enrichList(incoming),
  };
}

export async function createTransferRequest(
  session: SessionPayload,
  criminalId: string,
  toPoliceStationId: string,
  message?: string
): Promise<TransferListItem> {
  const fromPsId = await requireTransferPoliceStationId(session);

  if (!ObjectId.isValid(criminalId) || !ObjectId.isValid(toPoliceStationId)) {
    throw new AuthError("Invalid criminal or police station", 400);
  }

  const toPs = new ObjectId(toPoliceStationId);
  if (fromPsId.equals(toPs)) {
    throw new AuthError("Cannot transfer to the same police station", 400);
  }

  const targetStation = await PoliceStationModel.findById(toPoliceStationId);
  if (!targetStation?.active) {
    throw new AuthError("Target police station not found or inactive", 400);
  }

  const criminal = await CriminalModel.findById(criminalId);
  await assertCriminalAccess(session, criminal);

  if (!criminalBelongsToPoliceStation(criminal!, fromPsId)) {
    throw new AuthError("This criminal is not under your police station", 403);
  }

  const existingPending = await CriminalTransferModel.findPendingByCriminalId(
    criminal!._id!
  );
  if (existingPending) {
    throw new AuthError(
      "A pending transfer already exists for this criminal",
      409
    );
  }

  const now = new Date();
  const created = await CriminalTransferModel.create({
    criminalId: criminal!._id!,
    fromPoliceStationId: fromPsId,
    toPoliceStationId: toPs,
    requestedByAdminId: new ObjectId(session.sub),
    status: "pending",
    message: message?.trim() || undefined,
    createdAt: now,
    updatedAt: now,
  });

  const item = await enrichTransfer(created!, criminal);
  if (!item) throw new AuthError("Failed to create transfer", 500);
  return item;
}

async function applyTransferToCriminal(
  criminal: Criminal,
  toPsId: ObjectId
): Promise<void> {
  const patch = applyScopedAdminWrite(
    criminal as Omit<Criminal, "_id">,
    toPsId
  );
  const col = await getCriminalCollection();
  await col.updateOne(
    { _id: criminal._id! },
    {
      $set: { ...patch, updatedAt: new Date() },
      $unset: { assignedIoId: "" },
    }
  );
}

export async function acceptTransfer(
  session: SessionPayload,
  transferId: string
): Promise<TransferListItem> {
  const myPsId = await requireTransferPoliceStationId(session);

  const transfer = await CriminalTransferModel.findById(transferId);
  if (!transfer || transfer.status !== "pending") {
    throw new AuthError("Transfer request not found or already handled", 404);
  }

  if (!transfer.toPoliceStationId.equals(myPsId)) {
    throw new AuthError("Only the receiving police station can accept", 403);
  }

  const criminal = await CriminalModel.findById(transfer.criminalId.toString());
  if (!criminal) {
    throw new AuthError("Criminal record no longer exists", 404);
  }

  if (
    !criminalBelongsToPoliceStation(criminal, transfer.fromPoliceStationId)
  ) {
    throw new AuthError(
      "Criminal is no longer under the sending police station",
      409
    );
  }

  await applyTransferToCriminal(criminal, transfer.toPoliceStationId);

  const updated = await CriminalTransferModel.updateStatus(transferId, "accepted", {
    respondedByAdminId: new ObjectId(session.sub),
  });

  const item = await enrichTransfer(
    updated!,
    await CriminalModel.findById(transfer.criminalId.toString())
  );
  if (!item) throw new AuthError("Failed to load transfer", 500);
  return item;
}

export async function rejectTransfer(
  session: SessionPayload,
  transferId: string
): Promise<TransferListItem> {
  const myPsId = await requireTransferPoliceStationId(session);

  const transfer = await CriminalTransferModel.findById(transferId);
  if (!transfer || transfer.status !== "pending") {
    throw new AuthError("Transfer request not found or already handled", 404);
  }

  if (!transfer.toPoliceStationId.equals(myPsId)) {
    throw new AuthError("Only the receiving police station can reject", 403);
  }

  const updated = await CriminalTransferModel.updateStatus(transferId, "rejected", {
    respondedByAdminId: new ObjectId(session.sub),
  });

  const criminal = await CriminalModel.findById(transfer.criminalId.toString());
  const item = await enrichTransfer(updated!, criminal);
  if (!item) throw new AuthError("Failed to load transfer", 500);
  return item;
}

export async function cancelTransfer(
  session: SessionPayload,
  transferId: string
): Promise<TransferListItem> {
  const myPsId = await requireTransferPoliceStationId(session);

  const transfer = await CriminalTransferModel.findById(transferId);
  if (!transfer || transfer.status !== "pending") {
    throw new AuthError("Transfer request not found or already handled", 404);
  }

  if (!transfer.fromPoliceStationId.equals(myPsId)) {
    throw new AuthError("Only the sending police station can cancel", 403);
  }

  const updated = await CriminalTransferModel.updateStatus(transferId, "cancelled");

  const criminal = await CriminalModel.findById(transfer.criminalId.toString());
  const item = await enrichTransfer(updated!, criminal);
  if (!item) throw new AuthError("Failed to load transfer", 500);
  return item;
}
