/**
 * Server-only: Passwort-Hashing + 2FA-Code-Hashing + Cookie-Signatur.
 *
 * Hash-Schema (Passwort): `scrypt$N$r$p$saltB64$hashB64`
 *   - N = 2^15 = 32768, r = 8, p = 1, keyLen = 64 Bytes
 *   - Salt: 16 Bytes random
 *
 * 2FA-Code: 6 Ziffern, SHA-256 gespeichert. Maximal 5 Versuche, 10 Min Gültigkeit.
 */
import { createHmac, randomBytes, randomInt, scrypt, timingSafeEqual, createHash } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt) as (
  password: string | Buffer,
  salt: Buffer,
  keylen: number,
  options: { N: number; r: number; p: number; maxmem?: number },
) => Promise<Buffer>;

const SCRYPT_N = 32768;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const SCRYPT_KEYLEN = 64;
// 128 * N * r ≈ 32 MiB für N=32768, r=8 → Node-Default (32 MiB) liegt genau auf der Kante.
// Wir setzen die Obergrenze etwas höher, damit es nicht stoplert.
const SCRYPT_MAXMEM = 128 * 1024 * 1024;

// ---------------------------------------------------------------------------
// Passwort
// ---------------------------------------------------------------------------

export async function hashPassword(plain: string): Promise<string> {
  if (typeof plain !== "string" || plain.length < 8) {
    throw new Error("Passwort muss mindestens 8 Zeichen lang sein.");
  }
  const salt = randomBytes(16);
  const hash = await scryptAsync(plain.normalize("NFKC"), salt, SCRYPT_KEYLEN, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
    maxmem: SCRYPT_MAXMEM,
  });
  return `scrypt$${SCRYPT_N}$${SCRYPT_R}$${SCRYPT_P}$${salt.toString("base64")}$${hash.toString("base64")}`;
}

export async function verifyPassword(plain: string, stored: string): Promise<boolean> {
  if (typeof plain !== "string" || typeof stored !== "string") return false;
  const parts = stored.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const N = Number(parts[1]);
  const r = Number(parts[2]);
  const p = Number(parts[3]);
  const salt = Buffer.from(parts[4]!, "base64");
  const expected = Buffer.from(parts[5]!, "base64");
  if (!Number.isFinite(N) || !Number.isFinite(r) || !Number.isFinite(p) || !salt.length || !expected.length) {
    return false;
  }
  try {
    const actual = await scryptAsync(plain.normalize("NFKC"), salt, expected.length, {
      N,
      r,
      p,
      maxmem: SCRYPT_MAXMEM,
    });
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// 2FA-Code
// ---------------------------------------------------------------------------

export function generateSixDigitCode(): string {
  const n = randomInt(0, 1_000_000);
  return n.toString().padStart(6, "0");
}

export function hashCode(code: string): string {
  return createHash("sha256").update(code.replace(/\D/g, ""), "utf8").digest("hex");
}

export function compareCode(input: string, storedHex: string): boolean {
  const inHash = Buffer.from(hashCode(input), "hex");
  const stHash = Buffer.from(storedHex, "hex");
  if (inHash.length !== stHash.length) return false;
  return timingSafeEqual(inHash, stHash);
}

// ---------------------------------------------------------------------------
// Cookie-Signatur (HMAC-SHA256)
// ---------------------------------------------------------------------------

export function signValue(value: string, secret: string): string {
  const mac = createHmac("sha256", secret).update(value).digest("base64url");
  return `${value}.${mac}`;
}

export function verifySigned(signed: string, secret: string): string | null {
  if (!signed) return null;
  const dot = signed.lastIndexOf(".");
  if (dot < 1) return null;
  const value = signed.slice(0, dot);
  const mac = signed.slice(dot + 1);
  const expected = createHmac("sha256", secret).update(value).digest("base64url");
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return null;
  return timingSafeEqual(a, b) ? value : null;
}

// ---------------------------------------------------------------------------
// Misc
// ---------------------------------------------------------------------------

export function newId(bytes = 16): string {
  return randomBytes(bytes).toString("hex");
}

export function clientIpFromHeaders(h: Headers): string | undefined {
  const xff = h.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]!.trim();
    if (first) return first;
  }
  const real = h.get("x-real-ip");
  if (real) return real.trim();
  return undefined;
}
