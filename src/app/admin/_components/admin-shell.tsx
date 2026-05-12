import Link from "next/link";
import { headers } from "next/headers";
import { getAdminContext } from "@/lib/admin-session";
import { AdminLogoutButton } from "./admin-logout-button";

const NAV = [
  { href: "/admin", label: "Dashboard", match: (p: string) => p === "/admin" },
  { href: "/admin/orders", label: "Bestellungen", match: (p: string) => p.startsWith("/admin/orders") },
  { href: "/admin/users", label: "Benutzer", match: (p: string) => p.startsWith("/admin/users") },
  { href: "/admin/audit", label: "Audit-Log", match: (p: string) => p.startsWith("/admin/audit") },
];

export async function AdminShell({ children }: { children: React.ReactNode }) {
  const ctx = await getAdminContext();
  const hdrs = await headers();
  const pathname = hdrs.get("x-invoke-path") || hdrs.get("x-pathname") || "";

  // Login / Verify ohne Navigation
  const minimal = !ctx;

  return (
    <div className="min-h-screen bg-[#f6f6f8] text-foreground">
      <header className="border-b border-black/[0.07] bg-white">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/admin" className="flex items-center gap-2 text-[15px] font-semibold tracking-tight text-foreground">
            <span className="inline-flex size-7 items-center justify-center rounded-md bg-tint text-white text-[12px] font-bold">
              BP
            </span>
            <span>Admin</span>
          </Link>
          {!minimal ? (
            <nav className="hidden items-center gap-1 sm:flex">
              {NAV.map((n) => {
                const active = n.match(pathname);
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    className={`rounded-full px-3 py-1.5 text-[13px] font-medium transition ${
                      active
                        ? "bg-foreground text-white"
                        : "text-muted hover:bg-black/[0.05] hover:text-foreground"
                    }`}
                  >
                    {n.label}
                  </Link>
                );
              })}
            </nav>
          ) : null}
          <div className="flex items-center gap-2">
            {ctx ? (
              <>
                <span className="hidden text-[12px] text-muted sm:inline">{ctx.user.email}</span>
                <AdminLogoutButton />
              </>
            ) : (
              <Link
                href="/"
                className="rounded-full px-3 py-1.5 text-[12px] text-muted hover:bg-black/[0.05]"
              >
                Zur Website
              </Link>
            )}
          </div>
        </div>
        {!minimal ? (
          <nav className="flex gap-1 overflow-x-auto border-t border-black/[0.05] px-4 py-1.5 sm:hidden">
            {NAV.map((n) => {
              const active = n.match(pathname);
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[12px] font-medium transition ${
                    active ? "bg-foreground text-white" : "text-muted hover:bg-black/[0.05]"
                  }`}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
        ) : null}
      </header>
      <main className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 sm:py-8">{children}</main>
    </div>
  );
}
