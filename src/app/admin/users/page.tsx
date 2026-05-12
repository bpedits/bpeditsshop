import { requireAdmin } from "@/lib/admin-session";
import { listUsers } from "@/lib/admin-store";

function fmt(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("de-DE", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Europe/Berlin",
  });
}

export default async function AdminUsersPage() {
  await requireAdmin();
  const users = await listUsers();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Benutzer</h1>
        <p className="mt-1 text-[13px] text-muted">
          Verwaltung der Admin-Zugänge. Neue Benutzer werden aktuell über das Terminal angelegt:
        </p>
      </div>

      <div className="rounded-xl border border-black/[0.08] bg-white p-4 text-[13px] shadow-sm sm:p-5">
        <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-foreground">
          Neuen Benutzer anlegen
        </p>
        <pre className="mt-2 overflow-x-auto rounded-lg bg-[#f6f6f8] p-3 text-[12px] leading-relaxed">
{`# Im Projektordner auf dem Server
npm run admin:create-user -- --email "neue@adresse.de" --name "Vorname Nachname"
# Passwort wird interaktiv abgefragt und sicher gespeichert.`}
        </pre>
        <p className="mt-2 text-[12px] text-muted">
          Das Anlegen über die Web-Oberfläche kommt in einer nächsten Etappe — der Terminal-Weg ist
          sicherer (kein Klartext-Passwort über das Netz) und passt auch zum erstmaligen Setup.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-black/[0.08] bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-[13px]">
          <thead className="bg-black/[0.02] text-left text-[11px] uppercase tracking-[0.08em] text-muted">
            <tr>
              <th className="px-4 py-2 font-semibold">E-Mail</th>
              <th className="px-4 py-2 font-semibold">Name</th>
              <th className="px-4 py-2 font-semibold">Angelegt</th>
              <th className="px-4 py-2 font-semibold">Letzter Login</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/[0.05]">
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-[14px] text-muted">
                  Noch kein Benutzer angelegt.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-2 font-medium text-foreground">{u.email}</td>
                  <td className="px-4 py-2 text-muted">{u.name || "—"}</td>
                  <td className="px-4 py-2 text-muted">{fmt(u.createdAtIso)}</td>
                  <td className="px-4 py-2 text-muted">{fmt(u.lastLoginIso)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
