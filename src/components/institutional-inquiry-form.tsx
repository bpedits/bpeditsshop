"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { getInquiryFormAction } from "@/lib/quote-submit";

const orgTypes = [
  "Universität / Hochschule",
  "Biotech-Unternehmen",
  "CRO",
  "Pharma F&E",
  "Behörde / Öffentliche Einrichtung",
  "Sonstige Forschungseinrichtung",
] as const;

const inputClass =
  "mt-1.5 min-h-12 w-full rounded-xl border border-black/[0.1] bg-white px-3.5 py-3 text-[16px] text-foreground outline-none transition placeholder:text-muted/60 focus:border-tint focus:ring-2 focus:ring-tint/25 sm:min-h-11 sm:py-2.5 sm:text-[15px]";

const labelClass = "block text-[13px] font-medium text-muted";

type Props = {
  presetSku?: string;
  presetProductLine?: string;
  /** Optional JSON der Warenkorbzeilen für Form-Backend (Formspree o. Ä.) */
  cartSnapshotJson?: string;
};

export function InstitutionalInquiryForm({
  presetSku = "",
  presetProductLine = "",
  cartSnapshotJson = "",
}: Props) {
  const router = useRouter();

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const ref = `INQ-${Date.now().toString(36).toUpperCase()}`;
    fd.set("inquiry_ref", ref);
    fd.set("submitted_at", new Date().toISOString());

    const action = getInquiryFormAction();
    const businessEmail = String(fd.get("business_email") ?? "").trim();
    setBusy(true);
    try {
      if (action) {
        const res = await fetch(action, {
          method: "POST",
          body: fd,
          headers: { Accept: "application/json" },
        });
        if (!res.ok) {
          const t = await res.text().catch(() => "");
          throw new Error(t || `HTTP ${res.status}`);
        }
      }
      if (businessEmail) {
        void fetch("/api/inquiry-ack", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ email: businessEmail, ref }),
        }).catch(() => {});
      }
      try {
        sessionStorage.setItem("lastInquiryRef", ref);
      } catch {
        /* ignore */
      }
      router.push(`/anfrage-gesendet?ref=${encodeURIComponent(ref)}`);
    } catch {
      setError(
        "Die Anfrage konnte technisch nicht übermittelt werden. Bitte später erneut versuchen oder per E-Mail kontaktieren.",
      );
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {cartSnapshotJson ? <input type="hidden" name="cart_snapshot_json" value={cartSnapshotJson} /> : null}
      {presetSku ? <input type="hidden" name="preset_sku" value={presetSku} /> : null}
      {presetProductLine ? (
        <p className="rounded-xl border border-hairline bg-tint/[0.06] px-4 py-3 text-[13px] text-muted">
          <span className="font-medium text-foreground">
            {cartSnapshotJson ? "Auswahl aus dem Warenkorb:" : "Produkt vorbelegt:"}
          </span>{" "}
          <span className="whitespace-pre-wrap">{presetProductLine}</span>
        </p>
      ) : null}

      <fieldset className="space-y-4 rounded-[22px] border border-black/[0.06] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <legend className="text-[15px] font-semibold text-foreground">Organisation</legend>
        <div>
          <label htmlFor="org_name" className={labelClass}>
            Name der Organisation *
          </label>
          <input id="org_name" name="organization_name" required autoComplete="organization" className={inputClass} />
        </div>
        <div>
          <label htmlFor="org_type" className={labelClass}>
            Art der Organisation *
          </label>
          <select id="org_type" name="organization_type" required className={inputClass}>
            <option value="">Bitte wählen</option>
            {orgTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="org_country" className={labelClass}>
            Land (Sitz der Organisation) *
          </label>
          <input
            id="org_country"
            name="organization_country"
            required
            autoComplete="country-name"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="vat" className={labelClass}>
            USt-IdNr. / Steuer-ID *
          </label>
          <input id="vat" name="vat_tax_id" required autoComplete="off" className={inputClass} />
        </div>
        <div>
          <label htmlFor="website" className={labelClass}>
            Website der Organisation *
          </label>
          <input id="website" name="organization_website" type="url" required autoComplete="url" className={inputClass} />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Geschäftliche E-Mail *
          </label>
          <input id="email" name="business_email" type="email" required autoComplete="email" className={inputClass} />
        </div>
        <div>
          <label htmlFor="person" className={labelClass}>
            Verantwortliche Person *
          </label>
          <input id="person" name="responsible_person" required autoComplete="name" className={inputClass} />
        </div>
      </fieldset>

      <fieldset className="space-y-4 rounded-[22px] border border-black/[0.06] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <legend className="text-[15px] font-semibold text-foreground">Forschungsanfrage</legend>
        <div>
          <label htmlFor="research_use" className={labelClass}>
            Beabsichtigter Forschungszweck (in vitro / Labor) *
          </label>
          <textarea
            id="research_use"
            name="intended_research_use"
            required
            rows={4}
            className={`${inputClass} min-h-[120px] resize-y`}
            placeholder="Kurzbeschreibung des Labor- oder Zellkulturkontexts — keine personenbezogenen Anwendungen."
          />
        </div>
        <div>
          <label htmlFor="product_interest" className={labelClass}>
            Produkt von Interesse *
          </label>
          <textarea
            id="product_interest"
            name="product_of_interest"
            required
            rows={cartSnapshotJson ? 6 : 2}
            defaultValue={presetProductLine}
            className={`${inputClass} min-h-[4.5rem] resize-y sm:min-h-[3.25rem]`}
            placeholder="SKU oder Produktbezeichnung — bei Warenkorb mehrere Zeilen."
          />
        </div>
        <div>
          <label htmlFor="qty_range" className={labelClass}>
            Mengenrahmen (geschätzt) *
          </label>
          <input
            id="qty_range"
            name="quantity_range"
            required
            className={inputClass}
            placeholder="z. B. Evaluierungsset / wiederkehrende Labormenge"
          />
        </div>
        <div>
          <label htmlFor="ship_country" className={labelClass}>
            Lieferland *
          </label>
          <input id="ship_country" name="shipping_country" required autoComplete="country-name" className={inputClass} />
        </div>
        <div>
          <label htmlFor="proof" className={labelClass}>
            Institutioneller Nachweis (optional, empfohlen)
          </label>
          <input id="proof" name="institutional_proof" type="file" accept=".pdf,image/*" className="mt-1.5 block w-full text-[14px] text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-black/[0.06] file:px-3 file:py-2 file:text-[13px] file:font-medium file:text-foreground" />
          <p className="mt-1 text-[12px] text-muted">z. B. Bestellschein der Einrichtung, DUNS, oder äquivalent (PDF).</p>
        </div>
      </fieldset>

      <fieldset className="space-y-3 rounded-[22px] border border-black/[0.06] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <legend className="text-[15px] font-semibold text-foreground">Erklärungen *</legend>
        <label className="flex cursor-pointer gap-3 text-[14px] leading-snug text-muted">
          <input
            type="checkbox"
            name="cb_professional_entity"
            value="yes"
            required
            className="mt-1 size-4 shrink-0 rounded border-black/20 text-tint focus:ring-primary-focus/30"
          />
          <span>Ich vertrete eine professionelle Forschungseinrichtung.</span>
        </label>
        <label className="flex cursor-pointer gap-3 text-[14px] leading-snug text-muted">
          <input
            type="checkbox"
            name="cb_invitro_only"
            value="yes"
            required
            className="mt-1 size-4 shrink-0 rounded border-black/20 text-tint focus:ring-primary-focus/30"
          />
          <span>Diese Anfrage dient ausschließlich der in-vitro-Laborforschung.</span>
        </label>
        <label className="flex cursor-pointer gap-3 text-[14px] leading-snug text-muted">
          <input
            type="checkbox"
            name="cb_not_human_vet"
            value="yes"
            required
            className="mt-1 size-4 shrink-0 rounded border-black/20 text-tint focus:ring-primary-focus/30"
          />
          <span>Die Produkte sind nicht zur Anwendung am Menschen oder Tier bestimmt.</span>
        </label>
        <label className="flex cursor-pointer gap-3 text-[14px] leading-snug text-muted">
          <input
            type="checkbox"
            name="cb_no_consumer_resale"
            value="yes"
            required
            className="mt-1 size-4 shrink-0 rounded border-black/20 text-tint focus:ring-primary-focus/30"
          />
          <span>Die Produkte werden nicht an Endverbraucher weiterverkauft.</span>
        </label>
        <label className="flex cursor-pointer gap-3 text-[14px] leading-snug text-muted">
          <input
            type="checkbox"
            name="cb_accept_b2b_terms"
            value="yes"
            required
            className="mt-1 size-4 shrink-0 rounded border-black/20 text-tint focus:ring-primary-focus/30"
          />
          <span>
            Ich akzeptiere die{" "}
            <Link href="/forschungsbedingungen-b2b" className="font-medium text-tint hover:underline">
              B2B-Forschungsbedingungen
            </Link>
            .
          </span>
        </label>
      </fieldset>

      {error ? (
        <p className="rounded-xl border border-[#b00020]/25 bg-[#b00020]/[0.06] px-4 py-3 text-[14px] text-[#8a0000]" role="alert">
          {error}
        </p>
      ) : null}

      <p className="text-[12px] leading-relaxed text-muted">
        Es erfolgt kein automatischer Verkauf und keine automatische Rechnung auf dieser Domain. Status:{" "}
        <strong className="font-medium text-foreground">Pending Review</strong>. Bei Anbindung des
        Formulars werden Benachrichtigungen per E-Mail versendet.
      </p>

      <button
        type="submit"
        disabled={busy}
        className="inline-flex min-h-[52px] w-full touch-manipulation items-center justify-center gap-2 rounded-full bg-tint px-6 text-[15px] font-semibold text-white shadow-[0_8px_28px_-8px_rgba(0,102,204,0.4)] transition hover:opacity-92 motion-safe:active:scale-[0.98] disabled:opacity-50 motion-reduce:active:scale-100"
      >
        {busy ? (
          <>
            <svg className="size-5 shrink-0 animate-spin text-white" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path
                className="opacity-90"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Wird gesendet …
          </>
        ) : (
          "Anfrage senden"
        )}
      </button>
    </form>
  );
}
