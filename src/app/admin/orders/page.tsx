import Link from "next/link";
import { requireAdmin } from "@/lib/admin-session";
import {
  ORDER_STATUS_LABEL,
  type OrderStatus,
  readAllOrderStatuses,
} from "@/lib/admin-store";
import { listAllOrders, type StoredOrder } from "@/lib/order-store";
import { formatReferenceEur } from "@/lib/reference-price";

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleString("de-DE", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Europe/Berlin",
  });
}

type EnrichedOrder = StoredOrder & { statusKey: OrderStatus; statusLabel: string };

const STATUS_KEYS: OrderStatus[] = ["open", "paid", "shipped", "cancelled"];

const STATUS_CHIP: Record<OrderStatus, string> = {
  open: "bg-amber-100 text-amber-900",
  paid: "bg-emerald-100 text-emerald-900",
  shipped: "bg-sky-100 text-sky-900",
  cancelled: "bg-rose-100 text-rose-900",
};

export default async function AdminOrdersPage(props: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  await requireAdmin();
  const sp = await props.searchParams;
  const q = (sp.q ?? "").trim().toLowerCase();
  const filterStatus = STATUS_KEYS.includes(sp.status as OrderStatus)
    ? (sp.status as OrderStatus)
    : null;

  const [allOrders, statusMap] = await Promise.all([listAllOrders(), readAllOrderStatuses()]);
  const all: EnrichedOrder[] = allOrders.map((o) => {
    const statusKey = (statusMap.get(o.orderRef)?.status ?? "open") as OrderStatus;
    return { ...o, statusKey, statusLabel: ORDER_STATUS_LABEL[statusKey] };
  });

  let filtered = all;
  if (filterStatus) {
    filtered = filtered.filter((o) => o.statusKey === filterStatus);
  }
  if (q) {
    filtered = filtered.filter((o) => {
      return (
        o.orderRef.toLowerCase().includes(q) ||
        o.email.toLowerCase().includes(q) ||
        o.name.toLowerCase().includes(q) ||
        (o.company ?? "").toLowerCase().includes(q) ||
        o.shipping.countryLabel.toLowerCase().includes(q) ||
        o.shipping.city.toLowerCase().includes(q) ||
        o.shipping.postalCode.toLowerCase().includes(q) ||
        o.lines.some((l) => l.productName.toLowerCase().includes(q) || l.sku.toLowerCase().includes(q))
      );
    });
  }

  filtered.sort((a, b) => Date.parse(b.createdAtIso) - Date.parse(a.createdAtIso));

  const counts: Record<OrderStatus | "all", number> = {
    all: all.length,
    open: all.filter((o) => o.statusKey === "open").length,
    paid: all.filter((o) => o.statusKey === "paid").length,
    shipped: all.filter((o) => o.statusKey === "shipped").length,
    cancelled: all.filter((o) => o.statusKey === "cancelled").length,
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Bestellungen</h1>
          <p className="mt-1 text-[13px] text-muted">{filtered.length} von {all.length} angezeigt.</p>
        </div>
        <Link
          href="/api/admin/orders/export"
          className="rounded-full border border-black/[0.12] bg-white px-3 py-1.5 text-[12px] font-medium hover:bg-black/[0.04]"
        >
          CSV-Export
        </Link>
      </div>

      <form action="/admin/orders" method="get" className="flex flex-wrap items-end gap-2 rounded-xl border border-black/[0.08] bg-white px-4 py-3 shadow-sm">
        <label className="min-w-0 flex-1 sm:max-w-xs">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">Suche</span>
          <input
            name="q"
            defaultValue={q}
            placeholder="Bestellnr., E-Mail, Name, SKU…"
            className="mt-1 h-10 w-full rounded-lg border border-black/[0.12] bg-white px-3 text-[14px] outline-none ring-tint focus:ring-2"
          />
        </label>
        {filterStatus ? (
          <input type="hidden" name="status" value={filterStatus} />
        ) : null}
        <button
          type="submit"
          className="h-10 rounded-full bg-foreground px-4 text-[13px] font-medium text-white hover:opacity-92"
        >
          Suchen
        </button>
        {(q || filterStatus) ? (
          <Link
            href="/admin/orders"
            className="h-10 rounded-full border border-black/[0.12] bg-white px-4 text-[12px] font-medium leading-[2.4rem] text-muted hover:bg-black/[0.04]"
          >
            Filter zurücksetzen
          </Link>
        ) : null}
      </form>

      <div className="flex flex-wrap gap-1.5">
        <Chip href={buildHref(q, null)} active={!filterStatus} label={`Alle (${counts.all})`} />
        {STATUS_KEYS.map((s) => (
          <Chip
            key={s}
            href={buildHref(q, s)}
            active={filterStatus === s}
            label={`${ORDER_STATUS_LABEL[s]} (${counts[s]})`}
          />
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-black/[0.08] bg-white shadow-sm">
        {filtered.length === 0 ? (
          <div className="px-4 py-10 text-center text-[14px] text-muted">Keine Treffer.</div>
        ) : (
          <table className="w-full min-w-[680px] text-[13px]">
            <thead className="bg-black/[0.02] text-left text-[11px] uppercase tracking-[0.08em] text-muted">
              <tr>
                <th className="px-4 py-2 font-semibold">Bestellung</th>
                <th className="px-4 py-2 font-semibold">Kunde</th>
                <th className="px-4 py-2 font-semibold">Eingegangen</th>
                <th className="px-4 py-2 font-semibold">Status</th>
                <th className="px-4 py-2 text-right font-semibold">Summe</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.05]">
              {filtered.map((o) => (
                <tr key={o.orderRef} className="hover:bg-black/[0.02]">
                  <td className="px-4 py-2 align-top">
                    <Link
                      href={`/admin/orders/${encodeURIComponent(o.orderRef)}`}
                      className="font-mono font-semibold text-tint hover:underline"
                    >
                      {o.orderRef}
                    </Link>
                    <p className="mt-0.5 text-[11px] text-muted">
                      {o.lines.length} {o.lines.length === 1 ? "Position" : "Positionen"}
                    </p>
                  </td>
                  <td className="px-4 py-2 align-top">
                    <p className="truncate text-foreground">{o.name}</p>
                    <p className="truncate text-[11px] text-muted">{o.email}</p>
                  </td>
                  <td className="px-4 py-2 align-top text-muted">{fmtDate(o.createdAtIso)}</td>
                  <td className="px-4 py-2 align-top">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_CHIP[o.statusKey]}`}>
                      {o.statusLabel}
                    </span>
                  </td>
                  <td className="px-4 py-2 align-top text-right font-semibold tabular-nums">
                    {formatReferenceEur(o.totalEur)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function Chip({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      className={`rounded-full px-3 py-1 text-[12px] font-medium transition ${
        active ? "bg-foreground text-white" : "bg-white text-muted ring-1 ring-black/[0.08] hover:bg-black/[0.04]"
      }`}
    >
      {label}
    </Link>
  );
}

function buildHref(q: string, status: OrderStatus | null): string {
  const sp = new URLSearchParams();
  if (q) sp.set("q", q);
  if (status) sp.set("status", status);
  const s = sp.toString();
  return s ? `/admin/orders?${s}` : "/admin/orders";
}
