import Link from "next/link";
import { requireAdmin } from "@/lib/admin-session";
import {
  ORDER_STATUS_LABEL,
  type AuditEvent,
  type OrderStatus,
  readAllOrderStatuses,
  readRecentAudit,
} from "@/lib/admin-store";
import { listAllOrders, type StoredOrder } from "@/lib/order-store";
import { formatReferenceEur } from "@/lib/reference-price";
import {
  computeDashboardStats,
  type BestSellerRow,
  type DailyPoint,
  type MonthlyPoint,
  type PromoCodeRow,
  type RegionRow,
  type StatBucketWithDelta,
  type TopCustomerRow,
} from "@/lib/admin-stats";

export const dynamic = "force-dynamic";

const TZ = "Europe/Berlin";

const STATUS_CHIP: Record<OrderStatus, string> = {
  open: "bg-amber-100 text-amber-900",
  paid: "bg-emerald-100 text-emerald-900",
  shipped: "bg-sky-100 text-sky-900",
  cancelled: "bg-rose-100 text-rose-900",
};

const STATUS_ACCENT: Record<OrderStatus, string> = {
  open: "ring-amber-200/80",
  paid: "ring-emerald-200/80",
  shipped: "ring-sky-200/80",
  cancelled: "ring-rose-200/80",
};

const AUDIT_LABEL: Record<AuditEvent["type"], string> = {
  "auth.login.password_ok": "Login: Passwort akzeptiert",
  "auth.login.password_fail": "Login: Passwort falsch",
  "auth.login.code_sent": "Login: Code versendet",
  "auth.login.code_ok": "Login: Code akzeptiert",
  "auth.login.code_fail": "Login: Code falsch",
  "auth.logout": "Abmeldung",
  "order.status_changed": "Bestellstatus geändert",
  "order.note_changed": "Interne Notiz geändert",
  "order.resend_email": "Mail erneut versendet",
  "user.created": "Admin-User angelegt",
  "user.deleted": "Admin-User gelöscht",
};

function fmtDateShort(iso: string): string {
  return new Date(iso).toLocaleString("de-DE", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: TZ,
  });
}

function fmtTimeOnly(iso: string): string {
  return new Date(iso).toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TZ,
  });
}

function fmtRelative(iso: string, now: number): string {
  const diff = (Date.parse(iso) - now) / 1000;
  const abs = Math.abs(diff);
  const rtf = new Intl.RelativeTimeFormat("de-DE", { numeric: "auto" });
  if (abs < 60) return rtf.format(Math.round(diff), "second");
  if (abs < 3600) return rtf.format(Math.round(diff / 60), "minute");
  if (abs < 86_400) return rtf.format(Math.round(diff / 3600), "hour");
  if (abs < 86_400 * 14) return rtf.format(Math.round(diff / 86_400), "day");
  return new Date(iso).toLocaleDateString("de-DE", { dateStyle: "medium", timeZone: TZ });
}

function fmtInt(n: number): string {
  return new Intl.NumberFormat("de-DE").format(n);
}

function fmtPct(n: number | null): { text: string; positive: boolean | null } {
  if (n == null) return { text: "—", positive: null };
  const positive = n > 0;
  const sign = n > 0 ? "+" : n < 0 ? "" : "";
  return { text: `${sign}${n.toFixed(0)} %`, positive: n === 0 ? null : positive };
}

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

export default async function AdminDashboard() {
  await requireAdmin();

  const [allOrders, statusMap, auditEvents] = await Promise.all([
    listAllOrders(),
    readAllOrderStatuses(),
    readRecentAudit(10),
  ]);

  const stats = computeDashboardStats(allOrders, statusMap);
  const now = Date.now();
  const recent = allOrders.slice(0, 8);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Dashboard</h1>
          <p className="mt-1 text-[13px] text-muted">
            Stand {fmtDateShort(stats.generatedAtIso)} · {fmtInt(stats.total.count)}{" "}
            Bestellungen insgesamt · ⌀ Bestellwert {formatReferenceEur(stats.avgOrderValue)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/api/admin/orders/export"
            className="rounded-full border border-black/[0.12] bg-white px-3 py-1.5 text-[12px] font-medium hover:bg-black/[0.04]"
          >
            CSV-Export
          </Link>
          <Link
            href="/admin/orders"
            className="rounded-full bg-foreground px-3 py-1.5 text-[12px] font-medium text-white hover:opacity-92"
          >
            Alle Bestellungen
          </Link>
        </div>
      </header>

      {/* KPI-Karten */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Heute" data={stats.today} comparedTo="gestern" />
        <KpiCard label="Diese Woche" data={stats.week} comparedTo="Vorwoche" />
        <KpiCard label="Diesen Monat" data={stats.month} comparedTo="Vormonat" />
        <KpiSummaryCard
          countLabel="Bestellungen gesamt"
          revenueLabel="Referenzumsatz gesamt"
          count={stats.total.count}
          revenue={stats.total.revenue}
          aov={stats.avgOrderValue}
          customers={stats.total.uniqueCustomers}
        />
      </section>

      {/* Status-Pipeline */}
      <section>
        <h2 className="mb-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">
          Status-Pipeline
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {(["open", "paid", "shipped", "cancelled"] as const).map((s) => (
            <Link
              key={s}
              href={`/admin/orders?status=${s}`}
              className={`group rounded-xl border border-black/[0.08] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ring-1 ${STATUS_ACCENT[s]}`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_CHIP[s]}`}
                >
                  {ORDER_STATUS_LABEL[s]}
                </span>
                <span className="text-[11px] text-muted opacity-0 transition group-hover:opacity-100">
                  ansehen →
                </span>
              </div>
              <p className="mt-3 text-[24px] font-semibold tabular-nums tracking-tight text-foreground">
                {fmtInt(stats.statuses[s].count)}
              </p>
              <p className="mt-0.5 text-[12px] text-muted">
                {formatReferenceEur(stats.statuses[s].revenue)} Volumen
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Umsatz-Verlauf */}
      <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <RevenueChartCard points={stats.last30Days} />
        <MonthsTableCard rows={stats.last12Months} />
      </section>

      {/* Best-Seller */}
      <section>
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-[15px] font-semibold text-foreground">Top-Produkte</h2>
            <p className="text-[12px] text-muted">
              Aggregiert über alle Bestellungen — getrennt nach verkaufter Menge und Umsatzanteil.
            </p>
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <BestSellerTable
            title="Nach Menge"
            subtitle="Vials / Stück"
            rows={stats.bestSellersByQty}
            metric="qty"
          />
          <BestSellerTable
            title="Nach Umsatz"
            subtitle="Anteil am Gesamtumsatz"
            rows={stats.bestSellersByRevenue}
            metric="revenue"
          />
        </div>
      </section>

      {/* Top Kunden + Bundesländer */}
      <section className="grid gap-4 lg:grid-cols-2">
        <TopCustomersCard rows={stats.topCustomers} />
        <TopRegionsCard rows={stats.topRegions} />
      </section>

      {/* Promo-Codes (nur wenn vorhanden) */}
      {stats.promoCodes.length > 0 ? <PromoCodesCard rows={stats.promoCodes} /> : null}

      {/* Neueste Bestellungen + Aktivität */}
      <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <RecentOrdersCard orders={recent} statusMap={statusMap} />
        <ActivityCard events={auditEvents} now={now} />
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// KPI-Karten
// ---------------------------------------------------------------------------

function KpiCard({
  label,
  data,
  comparedTo,
}: {
  label: string;
  data: StatBucketWithDelta;
  comparedTo: string;
}) {
  const revDelta = fmtPct(data.revenueDeltaPct);
  const cntDelta = fmtPct(data.countDeltaPct);
  return (
    <div className="rounded-xl border border-black/[0.08] bg-white p-4 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
      <p className="mt-2 text-[26px] font-semibold tabular-nums tracking-tight text-foreground">
        {formatReferenceEur(data.revenue)}
      </p>
      <div className="mt-1.5 flex items-center gap-2 text-[12px]">
        <span className="text-muted">{fmtInt(data.count)} Bestellungen</span>
        <DeltaBadge {...cntDelta} />
      </div>
      <p className="mt-2 text-[11px] text-muted">
        Umsatz vs. {comparedTo}:{" "}
        <span
          className={
            revDelta.positive === true
              ? "font-medium text-emerald-700"
              : revDelta.positive === false
                ? "font-medium text-rose-700"
                : "font-medium text-muted"
          }
        >
          {revDelta.text}
        </span>
      </p>
    </div>
  );
}

function KpiSummaryCard({
  countLabel,
  revenueLabel,
  count,
  revenue,
  aov,
  customers,
}: {
  countLabel: string;
  revenueLabel: string;
  count: number;
  revenue: number;
  aov: number;
  customers: number;
}) {
  return (
    <div className="rounded-xl border border-black/[0.08] bg-foreground p-4 text-white shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/60">{revenueLabel}</p>
      <p className="mt-2 text-[26px] font-semibold tabular-nums tracking-tight">
        {formatReferenceEur(revenue)}
      </p>
      <p className="mt-1.5 text-[12px] text-white/70">
        {fmtInt(count)} {countLabel.toLowerCase()}
      </p>
      <dl className="mt-3 grid grid-cols-2 gap-2 border-t border-white/15 pt-3 text-[11px]">
        <div>
          <dt className="text-white/55">⌀ Bestellwert</dt>
          <dd className="mt-0.5 font-semibold tabular-nums">{formatReferenceEur(aov)}</dd>
        </div>
        <div>
          <dt className="text-white/55">Kunden (unique)</dt>
          <dd className="mt-0.5 font-semibold tabular-nums">{fmtInt(customers)}</dd>
        </div>
      </dl>
    </div>
  );
}

function DeltaBadge({ text, positive }: { text: string; positive: boolean | null }) {
  if (positive === null) {
    return (
      <span className="inline-flex items-center rounded-full bg-black/[0.05] px-1.5 py-0.5 text-[10px] font-medium text-muted">
        {text}
      </span>
    );
  }
  const cls = positive
    ? "bg-emerald-100 text-emerald-900"
    : "bg-rose-100 text-rose-900";
  return (
    <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${cls}`}>
      {positive ? "↑" : "↓"} {text.replace(/[+-]/, "").trim()}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Umsatz-Chart 30 Tage (reines SVG)
// ---------------------------------------------------------------------------

function RevenueChartCard({ points }: { points: DailyPoint[] }) {
  const maxRev = Math.max(1, ...points.map((p) => p.revenue));
  const totalRev = points.reduce((s, p) => s + p.revenue, 0);
  const totalCnt = points.reduce((s, p) => s + p.count, 0);
  const chartW = 600;
  const chartH = 160;
  const barW = chartW / points.length;

  return (
    <div className="rounded-xl border border-black/[0.08] bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-[15px] font-semibold text-foreground">Umsatz letzte 30 Tage</h2>
          <p className="text-[12px] text-muted">
            {formatReferenceEur(totalRev)} aus {fmtInt(totalCnt)} Bestellungen
          </p>
        </div>
        <div className="text-[11px] text-muted">
          ⌀{" "}
          <span className="tabular-nums text-foreground">
            {formatReferenceEur(totalCnt > 0 ? totalRev / totalCnt : 0)}
          </span>{" "}
          / Bestellung
        </div>
      </div>

      <svg
        role="img"
        aria-label="Tagesumsatz der letzten 30 Tage"
        viewBox={`0 0 ${chartW} ${chartH + 26}`}
        className="mt-4 block w-full"
        preserveAspectRatio="none"
      >
        {[0.25, 0.5, 0.75].map((r, i) => (
          <line
            key={i}
            x1={0}
            x2={chartW}
            y1={chartH - chartH * r}
            y2={chartH - chartH * r}
            stroke="currentColor"
            strokeOpacity={0.08}
            strokeDasharray="2 3"
          />
        ))}
        {points.map((p, i) => {
          const h = (p.revenue / maxRev) * (chartH - 8);
          const x = i * barW + 1.5;
          const y = chartH - h;
          const w = Math.max(2, barW - 3);
          const tooltip = `${p.label}: ${fmtInt(p.count)} Bestellungen, ${formatReferenceEur(p.revenue)}`;
          return (
            <g key={p.iso}>
              <rect
                x={x}
                y={y}
                width={w}
                height={Math.max(2, h)}
                rx={2}
                className={p.revenue > 0 ? "fill-foreground" : "fill-black/[0.08]"}
              >
                <title>{tooltip}</title>
              </rect>
            </g>
          );
        })}
        {/* X-Achsen-Labels nur jeden 5. Tag */}
        {points.map((p, i) =>
          i % 5 === 0 || i === points.length - 1 ? (
            <text
              key={p.iso + "-lbl"}
              x={i * barW + barW / 2}
              y={chartH + 16}
              textAnchor="middle"
              fontSize={10}
              fill="currentColor"
              opacity={0.55}
            >
              {p.label}
            </text>
          ) : null,
        )}
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Monatsumsatz-Tabelle (12 Monate)
// ---------------------------------------------------------------------------

function MonthsTableCard({ rows }: { rows: MonthlyPoint[] }) {
  const visible = rows.slice().reverse();
  const max = Math.max(1, ...rows.map((r) => r.revenue));
  return (
    <div className="rounded-xl border border-black/[0.08] bg-white p-4 shadow-sm sm:p-5">
      <h2 className="text-[15px] font-semibold text-foreground">Monatsumsatz</h2>
      <p className="text-[12px] text-muted">Letzte 12 Monate inkl. aktuellem.</p>
      <ul className="mt-3 divide-y divide-black/[0.05]">
        {visible.map((m) => {
          const w = Math.round((m.revenue / max) * 100);
          return (
            <li key={m.iso} className="grid grid-cols-[4.5rem_minmax(0,1fr)_5.5rem] items-center gap-2 py-2 text-[12px]">
              <span className="text-muted">{m.label}</span>
              <div className="relative h-2 rounded-full bg-black/[0.05]">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-foreground/85"
                  style={{ width: `${m.count > 0 ? Math.max(2, w) : 0}%` }}
                  aria-hidden
                />
              </div>
              <span className="text-right font-semibold tabular-nums text-foreground">
                {formatReferenceEur(m.revenue)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Best-Seller
// ---------------------------------------------------------------------------

function BestSellerTable({
  title,
  subtitle,
  rows,
  metric,
}: {
  title: string;
  subtitle: string;
  rows: BestSellerRow[];
  metric: "qty" | "revenue";
}) {
  const max = Math.max(
    1,
    ...rows.map((r) => (metric === "qty" ? r.qty : r.revenue)),
  );
  return (
    <div className="rounded-xl border border-black/[0.08] bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-end justify-between">
        <div>
          <h3 className="text-[14px] font-semibold text-foreground">{title}</h3>
          <p className="text-[11px] text-muted">{subtitle}</p>
        </div>
        <span className="text-[10px] uppercase tracking-[0.12em] text-muted">Top 10</span>
      </div>
      {rows.length === 0 ? (
        <p className="mt-6 text-center text-[13px] text-muted">Noch keine Daten.</p>
      ) : (
        <ol className="mt-3 space-y-1.5">
          {rows.map((r, idx) => {
            const v = metric === "qty" ? r.qty : r.revenue;
            const w = Math.max(2, Math.round((v / max) * 100));
            return (
              <li key={r.sku + r.productSlug} className="rounded-lg px-2 py-1.5 hover:bg-black/[0.02]">
                <div className="flex items-center justify-between gap-2 text-[12px]">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black/[0.06] text-[10px] font-semibold text-muted">
                      {idx + 1}
                    </span>
                    <span className="truncate font-medium text-foreground">{r.productName}</span>
                  </div>
                  <span className="shrink-0 font-semibold tabular-nums text-foreground">
                    {metric === "qty" ? `${fmtInt(r.qty)}×` : formatReferenceEur(r.revenue)}
                  </span>
                </div>
                <div className="ml-7 mt-1 h-1.5 rounded-full bg-black/[0.05]">
                  <div className="h-full rounded-full bg-tint/70" style={{ width: `${w}%` }} aria-hidden />
                </div>
                <p className="ml-7 mt-1 text-[10.5px] text-muted">
                  {fmtInt(r.orders)} {r.orders === 1 ? "Bestellung" : "Bestellungen"}
                  {" · "}
                  {metric === "qty"
                    ? formatReferenceEur(r.revenue) + " Umsatz"
                    : `${fmtInt(r.qty)} verkauft`}
                  {r.sku ? ` · SKU ${r.sku}` : ""}
                </p>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Top Kunden
// ---------------------------------------------------------------------------

function TopCustomersCard({ rows }: { rows: TopCustomerRow[] }) {
  return (
    <div className="rounded-xl border border-black/[0.08] bg-white p-4 shadow-sm sm:p-5">
      <h2 className="text-[15px] font-semibold text-foreground">Top Kunden</h2>
      <p className="text-[12px] text-muted">Sortiert nach Lifetime-Umsatz.</p>
      {rows.length === 0 ? (
        <p className="mt-6 text-center text-[13px] text-muted">Noch keine Bestellungen.</p>
      ) : (
        <ul className="mt-3 divide-y divide-black/[0.05]">
          {rows.slice(0, 5).map((c) => (
            <li key={c.email.toLowerCase()} className="flex items-center justify-between gap-3 py-2.5">
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium text-foreground">{c.name}</p>
                <p className="truncate text-[11px] text-muted">{c.email}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-[13px] font-semibold tabular-nums text-foreground">
                  {formatReferenceEur(c.revenue)}
                </p>
                <p className="text-[11px] text-muted">
                  {fmtInt(c.count)} {c.count === 1 ? "Bestellung" : "Bestellungen"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Bundesländer
// ---------------------------------------------------------------------------

function TopRegionsCard({ rows }: { rows: RegionRow[] }) {
  const max = Math.max(1, ...rows.map((r) => r.revenue));
  return (
    <div className="rounded-xl border border-black/[0.08] bg-white p-4 shadow-sm sm:p-5">
      <h2 className="text-[15px] font-semibold text-foreground">Top Bundesländer</h2>
      <p className="text-[12px] text-muted">Nach Versandadresse, Lifetime.</p>
      {rows.length === 0 ? (
        <p className="mt-6 text-center text-[13px] text-muted">Noch keine Daten.</p>
      ) : (
        <ul className="mt-3 space-y-1.5">
          {rows.slice(0, 8).map((r) => {
            const w = Math.max(2, Math.round((r.revenue / max) * 100));
            return (
              <li key={r.code} className="rounded-lg px-2 py-1.5">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="font-medium text-foreground">{r.label}</span>
                  <span className="font-semibold tabular-nums text-foreground">
                    {formatReferenceEur(r.revenue)}
                  </span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-black/[0.05]">
                  <div className="h-full rounded-full bg-tint/70" style={{ width: `${w}%` }} aria-hidden />
                </div>
                <p className="mt-1 text-[10.5px] text-muted">
                  {fmtInt(r.count)} {r.count === 1 ? "Bestellung" : "Bestellungen"}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Promo-Codes
// ---------------------------------------------------------------------------

function PromoCodesCard({ rows }: { rows: PromoCodeRow[] }) {
  return (
    <section className="rounded-xl border border-black/[0.08] bg-white p-4 shadow-sm sm:p-5">
      <h2 className="text-[15px] font-semibold text-foreground">Genutzte Promo-Codes</h2>
      <p className="text-[12px] text-muted">Anzahl Einlösungen + Umsatzanteil.</p>
      <table className="mt-3 w-full text-[13px]">
        <thead className="text-left text-[11px] uppercase tracking-[0.08em] text-muted">
          <tr>
            <th className="py-2 font-semibold">Code</th>
            <th className="py-2 text-right font-semibold">Einlösungen</th>
            <th className="py-2 text-right font-semibold">Umsatz</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/[0.05]">
          {rows.map((p) => (
            <tr key={p.code}>
              <td className="py-2 font-mono font-semibold">{p.code}</td>
              <td className="py-2 text-right tabular-nums">{fmtInt(p.count)}</td>
              <td className="py-2 text-right tabular-nums font-semibold">{formatReferenceEur(p.revenue)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Neueste Bestellungen
// ---------------------------------------------------------------------------

function RecentOrdersCard({
  orders,
  statusMap,
}: {
  orders: StoredOrder[];
  statusMap: Map<string, { status: OrderStatus }>;
}) {
  return (
    <div className="rounded-xl border border-black/[0.08] bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-black/[0.06] px-4 py-3 sm:px-5">
        <div>
          <h2 className="text-[15px] font-semibold text-foreground">Neueste Bestellungen</h2>
          <p className="text-[12px] text-muted">Die letzten {orders.length} Eingänge.</p>
        </div>
        <Link
          href="/admin/orders"
          className="text-[12px] font-medium text-tint hover:underline"
        >
          Alle ansehen →
        </Link>
      </header>
      {orders.length === 0 ? (
        <div className="px-4 py-10 text-center text-[14px] text-muted">Noch keine Bestellungen.</div>
      ) : (
        <ul className="divide-y divide-black/[0.05]">
          {orders.map((o) => {
            const s = (statusMap.get(o.orderRef)?.status ?? "open") as OrderStatus;
            return (
              <li key={o.orderRef} className="flex items-start justify-between gap-3 px-4 py-3 sm:px-5">
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/admin/orders/${encodeURIComponent(o.orderRef)}`}
                    className="font-mono text-[13px] font-semibold text-tint hover:underline"
                  >
                    {o.orderRef}
                  </Link>
                  <p className="mt-0.5 truncate text-[13px] text-foreground">
                    {o.name} · {o.email}
                  </p>
                  <p className="text-[11px] text-muted">{fmtDateShort(o.createdAtIso)}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[13px] font-semibold tabular-nums text-foreground">
                    {formatReferenceEur(o.totalEur)}
                  </p>
                  <span
                    className={`mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${STATUS_CHIP[s]}`}
                  >
                    {ORDER_STATUS_LABEL[s]}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Aktivität (Audit-Log)
// ---------------------------------------------------------------------------

function ActivityCard({ events, now }: { events: AuditEvent[]; now: number }) {
  return (
    <div className="rounded-xl border border-black/[0.08] bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-black/[0.06] px-4 py-3 sm:px-5">
        <div>
          <h2 className="text-[15px] font-semibold text-foreground">Aktivität</h2>
          <p className="text-[12px] text-muted">Die letzten {events.length} Ereignisse.</p>
        </div>
        <Link
          href="/admin/audit"
          className="text-[12px] font-medium text-tint hover:underline"
        >
          Audit-Log →
        </Link>
      </header>
      {events.length === 0 ? (
        <div className="px-4 py-10 text-center text-[14px] text-muted">Noch keine Aktivität.</div>
      ) : (
        <ul className="divide-y divide-black/[0.05]">
          {events.map((ev, idx) => (
            <li key={ev.tsIso + idx} className="px-4 py-3 sm:px-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-foreground">
                    {AUDIT_LABEL[ev.type] ?? ev.type}
                  </p>
                  <p className="mt-0.5 truncate text-[11px] text-muted">
                    {ev.actorEmail ?? "—"}
                    {ev.ip ? ` · ${ev.ip}` : ""}
                  </p>
                </div>
                <div className="shrink-0 text-right text-[11px] text-muted" title={fmtDateShort(ev.tsIso)}>
                  <p>{fmtRelative(ev.tsIso, now)}</p>
                  <p className="text-[10px]">{fmtTimeOnly(ev.tsIso)}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
