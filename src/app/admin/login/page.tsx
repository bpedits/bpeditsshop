import { redirect } from "next/navigation";
import { getAdminContext } from "@/lib/admin-session";
import { LoginForm } from "./login-form";

export default async function AdminLoginPage(props: {
  searchParams: Promise<{ next?: string }>;
}) {
  const sp = await props.searchParams;
  const ctx = await getAdminContext();
  if (ctx) {
    redirect(sp.next || "/admin");
  }
  return (
    <div className="mx-auto mt-8 max-w-md">
      <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Admin-Login</h1>
      <p className="mt-1 text-[13px] text-muted">
        Bitte mit E-Mail und Passwort anmelden. Anschließend kommt ein 6-stelliger Code per E-Mail.
      </p>
      <LoginForm nextHref={sp.next ?? "/admin"} />
    </div>
  );
}
