/**
 * Banküberweisung — Stammdaten nur serverseitig (ENV), nie NEXT_PUBLIC_*.
 */

export type BankTransferConfig = {
  accountHolder: string;
  iban: string;
  bic: string;
  institution?: string;
  extraNote?: string;
};

function normalizeIban(raw: string): string {
  return raw.replace(/\s/g, "").toUpperCase();
}

export function formatIbanGroups(iban: string): string {
  const n = normalizeIban(iban);
  return n.replace(/(.{4})/g, "$1 ").trim();
}

export function getBankTransferConfig(): BankTransferConfig | null {
  const accountHolder = process.env.BANK_ACCOUNT_HOLDER?.trim();
  const ibanRaw = process.env.BANK_IBAN?.trim();
  if (!accountHolder || !ibanRaw) return null;
  const iban = normalizeIban(ibanRaw);
  if (iban.length < 15) return null;

  const bic = process.env.BANK_BIC?.trim() || "";
  const institution = process.env.BANK_INSTITUTION?.trim() || undefined;
  const extraNote = process.env.BANK_PAYMENT_NOTE?.trim() || undefined;

  return {
    accountHolder,
    iban,
    bic: bic || "—",
    institution,
    extraNote,
  };
}

export function isBankTransferConfigured(): boolean {
  return getBankTransferConfig() !== null;
}
