import { requireAdmin } from "@/lib/admin-session";
import { readRecentAudit, type AuditEvent } from "@/lib/admin-store";

const TYPE_LABEL: Record<AuditEvent["type"], string> = {
  "auth.login.password_ok": "Passwort akzeptiert",
  "auth.login.password_fail": "Passwort falsch",
  "auth.login.code_sent": "Code per E-Mail gesendet",
  "auth.login.code_ok": "Login erfolgreich (2FA)",
  "auth.login.code_fail": "2FA-Code falsch",
  "auth.logout": "Logout",
  "order.status_changed": "Bestell-Status geändert",
  "order.note_changed": "Bestell-Notiz geändert",
  "order.resend_email": "Bestätigung erneut versandt",
  "user.created": "Benutzer angelegt",
  "user.deleted": "Benutzer entfernt",
};

const TYPE_TONE: Record<AuditEvent["type"], string> = {
  "auth.login.password_ok": "bg-emerald-50 text-emerald-900",
  "auth.login.password_fail": "bg-rose-50 text-rose-900",
  "auth.login.code_sent": "bg-sky-50 text-sky-900",
  "auth.login.code_ok": "bg-emerald-50 text-emerald-900",
  "auth.login.code_fail": "bg-rose-50 text-rose-900",
  "auth.logout": "bg-black/[0.05] text-muted",
  "order.status_changed": "bg-amber-50 text-amber-900",
  "order.note_changed": "bg-amber-50 text-amber-900",
  "order.resend_email": "bg-sky-50 text-sky-900",
  "user.created": "bg-emerald-50 text-emerald-900",
  "user.deleted": "bg-rose-50 text-rose-900",
};

function fmt(iso: string): string {
  return new Date(iso).toLocaleString("de-DE", {
    dateStyle: "short",
    timeStyle: "medium",
    timeZone: "Europe/Berlin",
  });
}

export default async function AdminAuditPage() {
  await requireAdmin();
  const events = await readRecentAudit(200);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Audit-Log</h1>
        <p className="mt-1 text-[13px] text-muted">Die letzten {events.length} Ereignisse (jüngste oben).</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-black/[0.08] bg-white shadow-sm">
        <table className="w-full min-w-[760px] text-[12px]">
          <thead className="bg-black/[0.02] text-left text-[11px] uppercase tracking-[0.08em] text-muted">
            <tr>
              <th className="px-4 py-2 font-semibold">Zeit</th>
              <th className="px-4 py-2 font-semibold">Ereignis</th>
              <th className="px-4 py-2 font-semibold">Akteur</th>
              <th className="px-4 py-2 font-semibold">IP</th>
              <th className="px-4 py-2 font-semibold">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/[0.05]">
            {events.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted">
                  Noch keine Ereignisse aufgezeichnet.
                </td>
              </tr>
            ) : (
              events.map((e, i) => (
                <tr key={`${e.tsIso}-${i}`}>
                  <td className="px-4 py-2 align-top text-muted">{fmt(e.tsIso)}</td>
                  <td className="px-4 py-2 align-top">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${TYPE_TONE[e.type]}`}>
                      {TYPE_LABEL[e.type]}
                    </span>
                  </td>
                  <td className="px-4 py-2 align-top text-foreground">
                    {e.actorEmail || (e.actorUserId ? `User ${e.actorUserId.slice(0, 8)}…` : "—")}
                  </td>
                  <td className="px-4 py-2 align-top font-mono text-muted">{e.ip ?? "—"}</td>
                  <td className="px-4 py-2 align-top text-muted">
                    {e.details ? (
                      <code className="block whitespace-pre-wrap break-all rounded bg-black/[0.04] px-2 py-1 text-[11px]">
                        {JSON.stringify(e.details)}
                      </code>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
