"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type StatusKey = "open" | "paid" | "shipped" | "cancelled";

const STATUSES: { key: StatusKey; label: string; chip: string }[] = [
  { key: "open", label: "Offen", chip: "bg-amber-100 text-amber-900" },
  { key: "paid", label: "Bezahlt", chip: "bg-emerald-100 text-emerald-900" },
  { key: "shipped", label: "Verschickt", chip: "bg-sky-100 text-sky-900" },
  { key: "cancelled", label: "Storniert", chip: "bg-rose-100 text-rose-900" },
];

export function OrderDetailClient({
  orderRef,
  initialStatus,
  initialNote,
  customerEmail,
}: {
  orderRef: string;
  initialStatus: StatusKey;
  initialNote: string;
  customerEmail: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<StatusKey>(initialStatus);
  const [note, setNote] = useState(initialNote);
  const [savedNote, setSavedNote] = useState(initialNote);
  const [busy, setBusy] = useState(false);
  const [resendBusy, setResendBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const noteDirty = note !== savedNote;

  async function saveStatus(next: StatusKey) {
    if (busy) return;
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/admin/orders/${encodeURIComponent(orderRef)}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!data.ok) {
        setMsg({ kind: "err", text: data.error || "Konnte nicht speichern." });
        return;
      }
      setStatus(next);
      setMsg({ kind: "ok", text: "Status gespeichert." });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function saveNote() {
    if (busy || !noteDirty) return;
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/admin/orders/${encodeURIComponent(orderRef)}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ internalNote: note }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!data.ok) {
        setMsg({ kind: "err", text: data.error || "Konnte nicht speichern." });
        return;
      }
      setSavedNote(note);
      setMsg({ kind: "ok", text: "Notiz gespeichert." });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function resendEmail() {
    if (resendBusy) return;
    setResendBusy(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/admin/orders/${encodeURIComponent(orderRef)}/resend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = (await res.json()) as { ok: boolean; error?: string; to?: string };
      if (!data.ok) {
        setMsg({ kind: "err", text: data.error || "Versand fehlgeschlagen." });
        return;
      }
      setMsg({ kind: "ok", text: `Bestätigung erneut an ${data.to || customerEmail} versendet.` });
    } finally {
      setResendBusy(false);
    }
  }

  return (
    <section className="rounded-xl border border-black/[0.08] bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">Status</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {STATUSES.map((s) => {
              const active = status === s.key;
              return (
                <button
                  key={s.key}
                  type="button"
                  disabled={busy || active}
                  onClick={() => void saveStatus(s.key)}
                  className={`rounded-full px-3 py-1 text-[12px] font-medium transition ${
                    active
                      ? s.chip + " ring-1 ring-black/10"
                      : "bg-white text-muted ring-1 ring-black/[0.08] hover:bg-black/[0.04] disabled:opacity-50"
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <button
            type="button"
            onClick={() => void resendEmail()}
            disabled={resendBusy}
            className="rounded-full border border-black/[0.12] bg-white px-3 py-1.5 text-[12px] font-medium hover:bg-black/[0.04] disabled:opacity-50"
          >
            {resendBusy ? "Sende..." : "Bestätigung erneut senden"}
          </button>
          <p className="text-[11px] text-muted">an {customerEmail}</p>
        </div>
      </div>

      <div className="mt-5">
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
            Interne Notiz (nicht für den Kunden sichtbar)
          </span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
            maxLength={4000}
            placeholder="z. B. Zahlungseingang am 12.05.; DHL-Paket #..."
            className="mt-1.5 w-full rounded-lg border border-black/[0.12] bg-white px-3 py-2 text-[14px] outline-none ring-tint focus:ring-2"
          />
        </label>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <p className="text-[11px] text-muted">
            {noteDirty ? "Ungespeicherte Änderungen" : "Gespeichert"} · {note.length}/4000
          </p>
          <button
            type="button"
            onClick={() => void saveNote()}
            disabled={busy || !noteDirty}
            className="rounded-full bg-foreground px-4 py-1.5 text-[12px] font-medium text-white hover:opacity-92 disabled:opacity-50"
          >
            Notiz speichern
          </button>
        </div>
      </div>

      {msg ? (
        <p
          className={`mt-3 rounded-lg px-3 py-2 text-[12px] ${
            msg.kind === "ok"
              ? "bg-emerald-50 text-emerald-900 ring-1 ring-emerald-200/60"
              : "bg-rose-50 text-rose-900 ring-1 ring-rose-200/60"
          }`}
          role="status"
        >
          {msg.text}
        </p>
      ) : null}
    </section>
  );
}
