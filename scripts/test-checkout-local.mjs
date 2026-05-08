/**
 * Lokaler Smoke-Test für POST /api/checkout (Stripe Testmodus).
 * Voraussetzung: `npm run dev` läuft, `.env.local` mit STRIPE_SECRET_KEY + NEXT_PUBLIC_SITE_URL.
 *
 * Aufruf: npm run test:checkout
 * Optional: TEST_URL=http://127.0.0.1:3000 npm run test:checkout
 */

const base = (process.env.TEST_URL || "http://localhost:43000").replace(/\/$/, "");

const body = {
  lines: [{ sku: "LCAR-10V", qty: 1 }],
};

async function main() {
  const url = `${base}/api/checkout`;
  let res;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (e) {
    console.error(`Keine Verbindung zu ${url} — läuft \`npm run dev\`?`);
    console.error(e);
    process.exit(1);
  }

  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }

  console.log("HTTP", res.status);
  console.log(JSON.stringify(json, null, 2));

  if (!res.ok) {
    process.exit(1);
  }
  if (!json.url || !String(json.url).includes("stripe.com")) {
    console.error("Erwartet: JSON mit url zu checkout.stripe.com");
    process.exit(1);
  }
  console.log("\nOK — Browser öffnen oder URL kopieren, mit Testkarte 4242… bezahlen.");
}

main();
