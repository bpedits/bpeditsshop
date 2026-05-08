/**
 * Optionales Backend für institutionelle Anfragen (statischer Export).
 * Setzen Sie NEXT_PUBLIC_INSTITUTIONAL_INQUIRY_ACTION auf eine Form-Endpunkt-URL
 * (z. B. Formspree, Getform, eigener Edge-Handler), der POST mit multipart/form-data akzeptiert.
 */
export function getInquiryFormAction(): string | null {
  const raw = process.env.NEXT_PUBLIC_INSTITUTIONAL_INQUIRY_ACTION?.trim();
  if (!raw || !/^https?:\/\//i.test(raw)) return null;
  return raw;
}
