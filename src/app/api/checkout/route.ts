import { NextResponse } from "next/server";
import { cartTotalEur, validateCartForPayment } from "@/lib/checkout-validate";
import { getStripe } from "@/lib/stripe-server";
import { siteOrigin } from "@/lib/site-origin";

function envAllowPromotionCodes(): boolean {
  const raw = process.env.STRIPE_ALLOW_PROMOTION_CODES?.trim().toLowerCase();
  if (!raw) return true;
  return raw === "1" || raw === "true" || raw === "yes" || raw === "on";
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return `${s.slice(0, max - 1)}…`;
}

export async function POST(req: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: "Zahlung ist nicht konfiguriert (STRIPE_SECRET_KEY fehlt)." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const payload = body as { lines?: unknown; promoCode?: unknown };
  const validated = validateCartForPayment(payload.lines);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  const { lines } = validated;
  const total = cartTotalEur(lines);
  if (total < 0.5) {
    return NextResponse.json({ error: "Mindestbestellwert nicht erreicht." }, { status: 400 });
  }

  const origin = siteOrigin();
  const rawPromo = typeof payload.promoCode === "string" ? payload.promoCode : "";
  const promoCode = rawPromo.trim().slice(0, 64);

  try {
    let discounts: Array<{ promotion_code?: string; coupon?: string }> | undefined;
    const allowPromoCodesInStripe = envAllowPromotionCodes() && !promoCode;
    if (promoCode) {
      const pcs = await stripe.promotionCodes.list({ code: promoCode, active: true, limit: 1 });
      const pc = pcs.data[0];
      if (pc) {
        discounts = [{ promotion_code: pc.id }];
      } else {
        // Fallback: Coupon-ID (z. B. "RS30") direkt akzeptieren, wenn vorhanden & gültig.
        try {
          const coupon = await stripe.coupons.retrieve(promoCode);
          const valid = Boolean(coupon.valid) && !coupon.deleted;
          if (!valid) {
            return NextResponse.json({ error: "Rabattcode ist ungültig oder abgelaufen." }, { status: 400 });
          }
          discounts = [{ coupon: coupon.id }];
        } catch {
          return NextResponse.json({ error: "Rabattcode ist ungültig oder abgelaufen." }, { status: 400 });
        }
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      allow_promotion_codes: allowPromoCodesInStripe,
      ...(discounts ? { discounts } : {}),
      line_items: lines.map((l) => ({
        quantity: l.qty,
        price_data: {
          currency: "eur",
          unit_amount: Math.round(l.listPriceEur * 100),
          product_data: {
            name: truncate(`${l.productName} (${l.sku})`, 120),
            description: truncate(l.packLabel || "RUO / Labor", 240),
            metadata: {
              sku: truncate(l.sku, 40),
              slug: truncate(l.productSlug, 40),
            },
          },
        },
      })),
      success_url: `${origin}/checkout/erfolg?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
      metadata: {
        cart_skus: truncate(
          lines.map((l) => `${l.sku}×${l.qty}`).join(","),
          450,
        ),
        ...(promoCode ? { promo_code: truncate(promoCode, 64) } : {}),
      },
      billing_address_collection: "required",
      phone_number_collection: { enabled: true },
    });

    if (!session.url) {
      return NextResponse.json({ error: "Keine Checkout-URL erhalten." }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Stripe-Fehler";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
