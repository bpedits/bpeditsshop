"use client";

import { useState } from "react";
import { brand } from "@/lib/brand";
import { FormSuccessCelebration } from "@/components/form-success-celebration";

const inputClass =
  "mt-2 w-full rounded-xl border border-black/[0.1] bg-surface-pearl/30 px-3.5 py-3 text-[15px] text-foreground outline-none transition placeholder:text-muted/70 focus:border-tint focus:bg-white focus:ring-2 focus:ring-tint/20";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{
    confirmationSent: boolean;
    mailtoFallback: string;
  } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: body.trim(),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        confirmationSent?: boolean;
        mailtoFallback?: string;
      };

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Übermittlung fehlgeschlagen.");
      }

      setSuccess({
        confirmationSent: Boolean(data.confirmationSent),
        mailtoFallback:
          typeof data.mailtoFallback === "string" ? data.mailtoFallback : `mailto:${brand.contactFormInboxEmail}`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bitte später erneut versuchen.");
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setSuccess(null);
    setName("");
    setEmail("");
    setSubject("");
    setBody("");
    setError(null);
  }

  if (success) {
    return (
      <div className="space-y-6 rounded-2xl border border-black/[0.07] bg-white p-6 shadow-[0_8px_36px_-20px_rgba(0,0,0,0.12)] sm:p-8">
        <FormSuccessCelebration
          eyebrow={success.confirmationSent ? "Bestätigung unterwegs" : "Fast geschafft"}
          title={success.confirmationSent ? "Nachricht eingegangen" : "Noch ein Schritt"}
          detail={
            success.confirmationSent ? (
              <p className="mx-auto max-w-md text-[14px] text-muted">
                Wir haben eine <strong className="font-medium text-foreground">Bestätigung</strong> an{" "}
                <span className="font-medium text-foreground">{email.trim()}</span> gesendet (bitte auch den
                Spam-Ordner prüfen).
              </p>
            ) : (
              <p className="mx-auto max-w-md text-[14px] text-muted">
                Automatische E-Mails sind noch nicht konfiguriert. Öffnen Sie unten Ihr E-Mail-Programm — Ihre
                Nachricht wird dort vorbereitet.
              </p>
            )
          }
        >
          {success.confirmationSent ? (
            <p>
              Unser Team wurde informiert und meldet sich bei Bedarf an die angegebene Adresse. Es kann werktags etwas
              dauern.
            </p>
          ) : (
            <p className="text-center">
              Tipp: Prüfen Sie, ob sich Ihr E-Mail-Client geöffnet hat — manche Browser blockieren{" "}
              <span className="font-medium text-foreground">mailto:</span>-Links.
            </p>
          )}
        </FormSuccessCelebration>

        <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:justify-center">
          {!success.confirmationSent ? (
            <a
              href={success.mailtoFallback}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-tint px-6 text-[15px] font-semibold text-white shadow-[0_8px_28px_-8px_rgba(0,102,204,0.45)] transition hover:opacity-92 motion-safe:active:scale-[0.98] motion-reduce:active:scale-100"
            >
              E-Mail-App öffnen
            </a>
          ) : (
            <a
              href={success.mailtoFallback}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-black/[0.12] bg-white px-5 text-[14px] font-medium text-foreground transition hover:bg-black/[0.03]"
            >
              Kopie manuell senden
            </a>
          )}
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-black/[0.1] bg-fill-secondary px-5 text-[14px] font-medium text-foreground transition hover:bg-fill-secondary-pressed"
          >
            Neue Nachricht
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 rounded-2xl border border-black/[0.07] bg-white p-6 shadow-[0_8px_36px_-20px_rgba(0,0,0,0.12)] sm:p-7"
    >
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Nachricht</p>
        <p className="mt-2 text-[18px] font-semibold tracking-tight text-foreground sm:text-[19px]">
          Schreiben Sie uns
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-muted sm:text-[14px]">
          Mit Absenden geht Ihre Nachricht an uns. Wo der E-Mail-Versand auf dem Server eingerichtet ist, erhalten Sie
          eine <strong className="font-medium text-foreground">Bestätigung in Ihr Postfach</strong> — sonst können Sie
          im Anschluss Ihre E-Mail-App mit vorbereitetem Text öffnen.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <label htmlFor="c-name" className="block text-[12px] font-semibold text-muted">
            Name
          </label>
          <input
            id="c-name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            className={inputClass}
            placeholder="Vor- und Nachname"
          />
        </div>
        <div className="sm:col-span-1">
          <label htmlFor="c-email" className="block text-[12px] font-semibold text-muted">
            E-Mail *
          </label>
          <input
            id="c-email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className={inputClass}
            placeholder="ihre@einrichtung.de"
          />
        </div>
      </div>

      <div>
        <label htmlFor="c-subject" className="block text-[12px] font-semibold text-muted">
          Betreff
        </label>
        <input
          id="c-subject"
          name="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className={inputClass}
          autoComplete="off"
          placeholder="z. B. CAS / SKU / institutionelle Anfrage"
        />
      </div>
      <div>
        <label htmlFor="c-body" className="block text-[12px] font-semibold text-muted">
          Nachricht *
        </label>
        <textarea
          id="c-body"
          name="message"
          required
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={7}
          placeholder="Kontext, gewünschte Menge, Lieferland Institut …"
          className={`${inputClass} min-h-[160px] resize-y leading-relaxed`}
        />
      </div>

      {error ? (
        <p className="rounded-xl border border-[#b00020]/25 bg-[#b00020]/[0.06] px-4 py-3 text-[14px] text-[#8a0000]" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={busy}
        className="inline-flex min-h-[48px] w-full touch-manipulation items-center justify-center gap-2 rounded-full bg-tint px-6 text-[15px] font-semibold text-white shadow-[0_8px_28px_-8px_rgba(0,102,204,0.45)] transition hover:opacity-92 disabled:opacity-55 motion-safe:active:scale-[0.98] motion-reduce:active:scale-100 sm:w-auto"
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
          <>Absenden</>
        )}
      </button>
    </form>
  );
}
