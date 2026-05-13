import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin-session";
import {
  ORDER_STATUS_LABEL,
  type OrderStatus,
  readOrderStatus,
} from "@/lib/admin-store";
import { readOrder } from "@/lib/order-store";
import { formatIbanGroups } from "@/lib/bank-transfer-config";
import { formatReferenceEur } from "@/lib/reference-price";
import { OrderDetailClient } from "./order-detail-client";

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleString("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Berlin",
  });
}

export default async function AdminOrderDetail(props: { params: Promise<{ ref: string }> }) {
  await requireAdmin();
  const params = await props.params;
  const orderRef = decodeURIComponent(params.ref);
  const order = await readOrder(orderRef);
  if (!order) return notFound();

  const status = await readOrderStatus(orderRef);
  const currentStatus: OrderStatus = status?.status ?? "open";

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">Bestellung</p>
          <h1 className="font-mono text-[22px] font-semibold tracking-tight text-foreground">{order.orderRef}</h1>
          <p className="text-[12px] text-muted">Eingegangen am {fmtDate(order.createdAtIso)}</p>
        </div>
        <Link
          href="/admin/orders"
          className="rounded-full border border-black/[0.12] bg-white px-3 py-1.5 text-[12px] font-medium hover:bg-black/[0.04]"
        >
          Zur Liste
        </Link>
      </div>

      <OrderDetailClient
        orderRef={order.orderRef}
        initialStatus={currentStatus}
        initialNote={status?.internalNote ?? ""}
        customerEmail={order.email}
      />

      <section className="grid gap-4 lg:grid-cols-3">
        <Card title="Kontakt">
          <p className="text-foreground">{order.name}</p>
          {order.company ? <p className="text-muted">{order.company}</p> : null}
          {order.taxNumber ? <p className="text-muted">Steuernummer: {order.taxNumber}</p> : null}
          {order.hrb ? <p className="text-muted">HRB: {order.hrb}</p> : null}
          <p className="text-muted">{order.email}</p>
        </Card>
        <Card title="Lieferadresse">
          <p className="text-foreground">{order.shipping.streetLine1}</p>
          {order.shipping.streetLine2 ? <p className="text-muted">{order.shipping.streetLine2}</p> : null}
          <p className="text-muted">{order.shipping.postalCode} {order.shipping.city}</p>
          <p className="text-muted">
            {order.shipping.countryCode === "DE"
              ? `${order.shipping.bundeslandLabel} · ${order.shipping.countryLabel}`
              : order.shipping.bundeslandLabel
                ? `${order.shipping.bundeslandLabel} · ${order.shipping.countryLabel}`
                : order.shipping.countryLabel}
          </p>
        </Card>
        <Card title="Bank (Snapshot)">
          <p className="text-foreground">{order.bankSnapshot.accountHolder}</p>
          <p className="font-mono text-[12px] text-muted">{formatIbanGroups(order.bankSnapshot.iban)}</p>
          <p className="font-mono text-[12px] text-muted">BIC {order.bankSnapshot.bic}</p>
          {order.bankSnapshot.institution ? (
            <p className="text-[12px] text-muted">{order.bankSnapshot.institution}</p>
          ) : null}
        </Card>
      </section>

      <section className="rounded-xl border border-black/[0.08] bg-white shadow-sm">
        <header className="border-b border-black/[0.06] px-4 py-3 sm:px-5">
          <h2 className="text-[14px] font-semibold text-foreground">Positionen</h2>
        </header>
        <table className="w-full text-[13px]">
          <thead className="bg-black/[0.02] text-left text-[11px] uppercase tracking-[0.08em] text-muted">
            <tr>
              <th className="px-4 py-2 font-semibold">Artikel</th>
              <th className="px-4 py-2 text-right font-semibold">Menge</th>
              <th className="px-4 py-2 text-right font-semibold">Pro Vial</th>
              <th className="px-4 py-2 text-right font-semibold">Zeile</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/[0.05]">
            {order.lines.map((l) => (
              <tr key={l.sku}>
                <td className="px-4 py-2">
                  <p className="font-medium text-foreground">
                    {l.productName}
                    {l.packLabel ? <span className="text-muted"> · {l.packLabel}</span> : null}
                  </p>
                  <p className="font-mono text-[11px] text-muted">{l.sku}</p>
                </td>
                <td className="px-4 py-2 text-right tabular-nums">{l.qty}</td>
                <td className="px-4 py-2 text-right tabular-nums">{formatReferenceEur(l.listPriceEur)}</td>
                <td className="px-4 py-2 text-right tabular-nums font-semibold">
                  {formatReferenceEur(l.listPriceEur * l.qty)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-black/[0.08] bg-black/[0.02]">
              <td colSpan={3} className="px-4 py-2 text-right font-semibold">Summe</td>
              <td className="px-4 py-2 text-right font-semibold tabular-nums">
                {formatReferenceEur(order.totalEur)}
              </td>
            </tr>
          </tfoot>
        </table>
      </section>

      {order.note ? (
        <Card title="Kundennotiz">
          <p className="whitespace-pre-wrap text-muted">{order.note}</p>
        </Card>
      ) : null}

      {order.promoCode ? (
        <Card title="Rabattcode">
          <p className="font-mono text-[14px] text-foreground">{order.promoCode}</p>
          <p className="mt-1 text-[12px] text-muted">
            Vom Kunden vermerkt — manuell prüfen, ob noch gültig.
          </p>
        </Card>
      ) : null}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-black/[0.08] bg-white p-4 text-[13px] leading-relaxed shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-foreground">{title}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}
