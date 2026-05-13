/**
 * Aggregations-Helfer für das Admin-Dashboard.
 *
 * Reine In-Memory-Berechnungen über bereits geladene `StoredOrder`-Listen +
 * `OrderStatusRecord`-Maps. Keine Side-Effects, keine DB-Aufrufe.
 */
import type { OrderStatus, OrderStatusRecord } from "@/lib/admin-store";
import type { StoredOrder } from "@/lib/order-store";

export type StatBucket = {
  count: number;
  revenue: number;
  uniqueCustomers: number;
};

export type StatBucketWithDelta = StatBucket & {
  prevCount: number;
  prevRevenue: number;
  countDeltaPct: number | null;
  revenueDeltaPct: number | null;
};

export type DailyPoint = {
  iso: string;
  label: string;
  count: number;
  revenue: number;
};

export type MonthlyPoint = {
  iso: string;
  label: string;
  count: number;
  revenue: number;
  avg: number;
};

export type BestSellerRow = {
  sku: string;
  productSlug: string;
  productName: string;
  qty: number;
  revenue: number;
  orders: number;
};

export type TopCustomerRow = {
  email: string;
  name: string;
  count: number;
  revenue: number;
  lastIso: string;
};

export type RegionRow = {
  code: string;
  label: string;
  count: number;
  revenue: number;
};

export type PromoCodeRow = {
  code: string;
  count: number;
  revenue: number;
};

export type StatusBreakdown = Record<OrderStatus | "all", { count: number; revenue: number }>;

const TZ = "Europe/Berlin";

function startOfDay(d: Date): number {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.getTime();
}

function startOfWeekMonday(d: Date): number {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7;
  x.setDate(x.getDate() - day);
  x.setHours(0, 0, 0, 0);
  return x.getTime();
}

function startOfMonth(d: Date): number {
  const x = new Date(d);
  x.setDate(1);
  x.setHours(0, 0, 0, 0);
  return x.getTime();
}

function addDays(ts: number, days: number): number {
  return ts + days * 86_400_000;
}

function addMonths(ts: number, months: number): number {
  const d = new Date(ts);
  d.setMonth(d.getMonth() + months);
  return d.getTime();
}

function pctDelta(curr: number, prev: number): number | null {
  if (prev === 0) return curr === 0 ? 0 : null;
  return ((curr - prev) / prev) * 100;
}

function bucketFromOrders(orders: StoredOrder[]): StatBucket {
  const customers = new Set<string>();
  let revenue = 0;
  for (const o of orders) {
    revenue += o.totalEur;
    customers.add(o.email.toLowerCase());
  }
  return { count: orders.length, revenue, uniqueCustomers: customers.size };
}

function bucketBetween(orders: StoredOrder[], fromTs: number, toTs: number): StatBucket {
  return bucketFromOrders(
    orders.filter((o) => {
      const t = Date.parse(o.createdAtIso);
      return t >= fromTs && t < toTs;
    }),
  );
}

function bucketWithDelta(orders: StoredOrder[], curr: [number, number], prev: [number, number]): StatBucketWithDelta {
  const c = bucketBetween(orders, curr[0], curr[1]);
  const p = bucketBetween(orders, prev[0], prev[1]);
  return {
    ...c,
    prevCount: p.count,
    prevRevenue: p.revenue,
    countDeltaPct: pctDelta(c.count, p.count),
    revenueDeltaPct: pctDelta(c.revenue, p.revenue),
  };
}

// ---------------------------------------------------------------------------
// Öffentliche API
// ---------------------------------------------------------------------------

export type DashboardStats = {
  generatedAtIso: string;
  total: StatBucket;
  today: StatBucketWithDelta;
  week: StatBucketWithDelta;
  month: StatBucketWithDelta;
  avgOrderValue: number;
  statuses: StatusBreakdown;
  last30Days: DailyPoint[];
  last12Months: MonthlyPoint[];
  bestSellersByQty: BestSellerRow[];
  bestSellersByRevenue: BestSellerRow[];
  topCustomers: TopCustomerRow[];
  topRegions: RegionRow[];
  promoCodes: PromoCodeRow[];
};

export function computeDashboardStats(
  orders: StoredOrder[],
  statusMap: Map<string, OrderStatusRecord>,
  now: Date = new Date(),
): DashboardStats {
  // --- Zeit-Marker ---------------------------------------------------------
  const todayStart = startOfDay(now);
  const tomorrowStart = addDays(todayStart, 1);
  const yesterdayStart = addDays(todayStart, -1);

  const weekStart = startOfWeekMonday(now);
  const nextWeekStart = addDays(weekStart, 7);
  const prevWeekStart = addDays(weekStart, -7);

  const monthStart = startOfMonth(now);
  const nextMonthStart = addMonths(monthStart, 1);
  const prevMonthStart = addMonths(monthStart, -1);

  // --- Gesamt + KPIs -------------------------------------------------------
  const total = bucketFromOrders(orders);

  const today = bucketWithDelta(
    orders,
    [todayStart, tomorrowStart],
    [yesterdayStart, todayStart],
  );
  const week = bucketWithDelta(
    orders,
    [weekStart, nextWeekStart],
    [prevWeekStart, weekStart],
  );
  const month = bucketWithDelta(
    orders,
    [monthStart, nextMonthStart],
    [prevMonthStart, monthStart],
  );

  const avgOrderValue = total.count > 0 ? total.revenue / total.count : 0;

  // --- Status-Verteilung ---------------------------------------------------
  const statuses: StatusBreakdown = {
    all: { count: total.count, revenue: total.revenue },
    open: { count: 0, revenue: 0 },
    paid: { count: 0, revenue: 0 },
    shipped: { count: 0, revenue: 0 },
    cancelled: { count: 0, revenue: 0 },
  };
  for (const o of orders) {
    const s = (statusMap.get(o.orderRef)?.status ?? "open") as OrderStatus;
    statuses[s].count += 1;
    statuses[s].revenue += o.totalEur;
  }

  // --- Tages-Reihe (letzte 30 Tage, inkl. heute) ---------------------------
  const last30Days: DailyPoint[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(addDays(todayStart, -i));
    const fmtLabel = new Intl.DateTimeFormat("de-DE", {
      day: "2-digit",
      month: "2-digit",
      timeZone: TZ,
    }).format(d);
    last30Days.push({
      iso: new Date(addDays(todayStart, -i)).toISOString(),
      label: fmtLabel,
      count: 0,
      revenue: 0,
    });
  }
  const dayIndex = new Map<number, DailyPoint>();
  for (let i = 0; i < last30Days.length; i++) {
    const dayKey = startOfDay(new Date(last30Days[i]!.iso));
    dayIndex.set(dayKey, last30Days[i]!);
  }
  for (const o of orders) {
    const dayKey = startOfDay(new Date(o.createdAtIso));
    const slot = dayIndex.get(dayKey);
    if (!slot) continue;
    slot.count += 1;
    slot.revenue += o.totalEur;
  }

  // --- Monats-Reihe (letzte 12 Monate, inkl. aktueller Monat) --------------
  const last12Months: MonthlyPoint[] = [];
  for (let i = 11; i >= 0; i--) {
    const mStart = addMonths(monthStart, -i);
    const d = new Date(mStart);
    const fmtLabel = new Intl.DateTimeFormat("de-DE", {
      month: "short",
      year: "2-digit",
      timeZone: TZ,
    }).format(d);
    last12Months.push({
      iso: new Date(mStart).toISOString(),
      label: fmtLabel,
      count: 0,
      revenue: 0,
      avg: 0,
    });
  }
  const monthIndex = new Map<number, MonthlyPoint>();
  for (let i = 0; i < last12Months.length; i++) {
    const mKey = startOfMonth(new Date(last12Months[i]!.iso));
    monthIndex.set(mKey, last12Months[i]!);
  }
  for (const o of orders) {
    const mKey = startOfMonth(new Date(o.createdAtIso));
    const slot = monthIndex.get(mKey);
    if (!slot) continue;
    slot.count += 1;
    slot.revenue += o.totalEur;
  }
  for (const m of last12Months) {
    m.avg = m.count > 0 ? m.revenue / m.count : 0;
  }

  // --- Best-Seller ---------------------------------------------------------
  type Agg = BestSellerRow & { orderSet: Set<string> };
  const productMap = new Map<string, Agg>();
  for (const o of orders) {
    for (const l of o.lines) {
      const key = l.sku || l.productSlug;
      const exist =
        productMap.get(key) ?? {
          sku: l.sku,
          productSlug: l.productSlug,
          productName: l.productName,
          qty: 0,
          revenue: 0,
          orders: 0,
          orderSet: new Set<string>(),
        };
      exist.qty += l.qty;
      exist.revenue += l.qty * l.listPriceEur;
      exist.orderSet.add(o.orderRef);
      productMap.set(key, exist);
    }
  }
  const allProducts: BestSellerRow[] = [];
  for (const v of productMap.values()) {
    allProducts.push({
      sku: v.sku,
      productSlug: v.productSlug,
      productName: v.productName,
      qty: v.qty,
      revenue: v.revenue,
      orders: v.orderSet.size,
    });
  }
  const bestSellersByQty = [...allProducts]
    .sort((a, b) => b.qty - a.qty || b.revenue - a.revenue)
    .slice(0, 10);
  const bestSellersByRevenue = [...allProducts]
    .sort((a, b) => b.revenue - a.revenue || b.qty - a.qty)
    .slice(0, 10);

  // --- Top Kunden ----------------------------------------------------------
  const customerMap = new Map<string, TopCustomerRow>();
  for (const o of orders) {
    const key = o.email.toLowerCase();
    const exist =
      customerMap.get(key) ?? {
        email: o.email,
        name: o.name,
        count: 0,
        revenue: 0,
        lastIso: o.createdAtIso,
      };
    exist.count += 1;
    exist.revenue += o.totalEur;
    if (Date.parse(o.createdAtIso) > Date.parse(exist.lastIso)) {
      exist.lastIso = o.createdAtIso;
      exist.name = o.name;
    }
    customerMap.set(key, exist);
  }
  const topCustomers = [...customerMap.values()]
    .sort((a, b) => b.revenue - a.revenue || b.count - a.count)
    .slice(0, 10);

  // --- Top Regionen / Länder (DE: Bundesland; sonst Land + ggf. Region) -----
  const regionMap = new Map<string, RegionRow>();
  for (const o of orders) {
    const cc = (o.shipping?.countryCode || "DE").toUpperCase();
    const isDe = cc === "DE";
    const key = isDe ? (o.shipping?.bundeslandCode || "??").toUpperCase() : cc;
    const label = isDe
      ? o.shipping?.bundeslandLabel || key
      : o.shipping?.bundeslandLabel
        ? `${o.shipping.bundeslandLabel} (${o.shipping.countryLabel})`
        : o.shipping?.countryLabel || key;
    const exist =
      regionMap.get(key) ?? {
        code: key,
        label,
        count: 0,
        revenue: 0,
      };
    exist.count += 1;
    exist.revenue += o.totalEur;
    regionMap.set(key, exist);
  }
  const topRegions = [...regionMap.values()]
    .sort((a, b) => b.revenue - a.revenue || b.count - a.count)
    .slice(0, 10);

  // --- Promo-Codes ---------------------------------------------------------
  const promoMap = new Map<string, PromoCodeRow>();
  for (const o of orders) {
    const code = (o.promoCode || "").trim();
    if (!code) continue;
    const key = code.toUpperCase();
    const exist = promoMap.get(key) ?? { code: key, count: 0, revenue: 0 };
    exist.count += 1;
    exist.revenue += o.totalEur;
    promoMap.set(key, exist);
  }
  const promoCodes = [...promoMap.values()].sort((a, b) => b.count - a.count || b.revenue - a.revenue);

  return {
    generatedAtIso: now.toISOString(),
    total,
    today,
    week,
    month,
    avgOrderValue,
    statuses,
    last30Days,
    last12Months,
    bestSellersByQty,
    bestSellersByRevenue,
    topCustomers,
    topRegions,
    promoCodes,
  };
}
