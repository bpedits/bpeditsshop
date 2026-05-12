"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm({ nextHref }: { nextHref: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!data.ok) {
        setError(data.error || "Login fehlgeschlagen.");
        setBusy(false);
        return;
      }
      const params = new URLSearchParams();
      params.set("next", nextHref || "/admin");
      router.push(`/admin/verify?${params.toString()}`);
    } catch (err) {
      console.error(err);
      setError("Verbindung fehlgeschlagen. Bitte erneut versuchen.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-3 rounded-xl border border-black/[0.08] bg-white p-5 shadow-sm">
      <label className="block">
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">E-Mail</span>
        <input
          type="email"
          name="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1.5 h-11 w-full rounded-lg border border-black/[0.12] bg-white px-3 text-[14px] outline-none ring-tint focus:ring-2"
          placeholder="name@bavaria-peptides.com"
        />
      </label>
      <label className="block">
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">Passwort</span>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1.5 h-11 w-full rounded-lg border border-black/[0.12] bg-white px-3 text-[14px] outline-none ring-tint focus:ring-2"
        />
      </label>
      {error ? (
        <p className="rounded-lg border border-[#b00020]/20 bg-[#b00020]/[0.06] px-3 py-2 text-[13px] text-[#7a0000]" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={busy}
        className="inline-flex h-11 w-full items-center justify-center rounded-full bg-tint px-5 text-[14px] font-semibold text-white transition hover:opacity-92 disabled:opacity-50"
      >
        {busy ? "Wird gesendet..." : "Code per E-Mail anfordern"}
      </button>
    </form>
  );
}
