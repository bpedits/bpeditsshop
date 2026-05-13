/**
 * Lokaler Smoke-Test für POST /api/bank-order.
 * Voraussetzung: `npm run dev`, `.env.local` mit SMTP_* + BANK_* (siehe .env.example).
 *
 * Aufruf: npm run test:bank-order
 * Optional: TEST_URL=http://127.0.0.1:3000 TO=meine@adresse.de npm run test:bank-order
 */

const base = (process.env.TEST_URL || "http://localhost:3000").replace(/\/$/, "");

const body = {
  email: process.env.TO || "test@example.com",
  name: "Test Nutzer",
  company: "",
  taxNumber: "",
  hrb: "",
  note: "Smoke-Test Bank-Bestellung",
  promoCode: "",
  shipping: {
    countryCode: "AT",
    region: "Wien",
    postalCode: "1010",
    city: "Wien",
    streetLine1: "Mariahilfer Straße 1",
    streetLine2: "",
  },
  lines: [{ sku: "LCAR-10V", qty: 1 }],
};

async function main() {
  const url = `${base}/api/bank-order`;
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
  if (!json.ok || !json.orderRef || !String(json.redirectTo || "").includes("/checkout/erfolg")) {
    console.error("Erwartet: ok, orderRef, redirectTo mit /checkout/erfolg");
    process.exit(1);
  }
  console.log("\nOK — E-Mails sollten über SMTP (Zoho) rausgegangen sein.");
}

main();
