import { NextResponse } from "next/server";
import {
  appendAudit,
  type OrderStatus,
  ORDER_STATUS_LABEL,
  readOrderStatus,
  writeOrderStatus,
} from "@/lib/admin-store";
import { clientIpFromHeaders } from "@/lib/admin-auth";
import { getAdminContext } from "@/lib/admin-session";
import { readOrder } from "@/lib/order-store";

const ALLOWED: ReadonlyArray<OrderStatus> = ["open", "paid", "shipped", "cancelled"];

export async function POST(req: Request, ctx: { params: Promise<{ ref: string }> }) {
  const admin = await getAdminContext();
  if (!admin) {
    return NextResponse.json({ ok: false, error: "Nicht angemeldet." }, { status: 401 });
  }

  const { ref } = await ctx.params;
  const orderRef = decodeURIComponent(ref || "");
  const order = await readOrder(orderRef);
  if (!order) {
    return NextResponse.json({ ok: false, error: "Bestellung nicht gefunden." }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Ungültige Anfrage." }, { status: 400 });
  }

  const o = (body || {}) as Record<string, unknown>;
  const wantStatusRaw = typeof o.status === "string" ? o.status.trim().toLowerCase() : null;
  const wantNoteRaw = typeof o.internalNote === "string" ? o.internalNote : null;

  const current = (await readOrderStatus(orderRef)) ?? {
    orderRef,
    status: "open" as OrderStatus,
    updatedAtIso: order.createdAtIso,
  };

  let didChangeStatus = false;
  let didChangeNote = false;

  if (wantStatusRaw && ALLOWED.includes(wantStatusRaw as OrderStatus)) {
    if (current.status !== wantStatusRaw) {
      current.status = wantStatusRaw as OrderStatus;
      didChangeStatus = true;
    }
  }

  if (wantNoteRaw !== null) {
    const cleaned = wantNoteRaw.slice(0, 4000);
    if ((current.internalNote ?? "") !== cleaned) {
      current.internalNote = cleaned;
      didChangeNote = true;
    }
  }

  if (!didChangeStatus && !didChangeNote) {
    return NextResponse.json({ ok: true, status: current.status, internalNote: current.internalNote ?? "" });
  }

  current.updatedAtIso = new Date().toISOString();
  current.updatedByUserId = admin.user.id;
  await writeOrderStatus(current);

  const ip = clientIpFromHeaders(req.headers);
  if (didChangeStatus) {
    await appendAudit({
      tsIso: new Date().toISOString(),
      type: "order.status_changed",
      actorUserId: admin.user.id,
      actorEmail: admin.user.email,
      ip,
      details: { orderRef, status: current.status, label: ORDER_STATUS_LABEL[current.status] },
    });
  }
  if (didChangeNote) {
    await appendAudit({
      tsIso: new Date().toISOString(),
      type: "order.note_changed",
      actorUserId: admin.user.id,
      actorEmail: admin.user.email,
      ip,
      details: { orderRef },
    });
  }

  return NextResponse.json({ ok: true, status: current.status, internalNote: current.internalNote ?? "" });
}
