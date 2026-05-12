import { redirect } from "next/navigation";
import { getAdminContext } from "@/lib/admin-session";
import { VerifyForm } from "./verify-form";

export default async function AdminVerifyPage(props: {
  searchParams: Promise<{ next?: string }>;
}) {
  const sp = await props.searchParams;
  const ctx = await getAdminContext();
  if (ctx) {
    redirect(sp.next || "/admin");
  }
  return (
    <div className="mx-auto mt-8 max-w-md">
      <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Code eingeben</h1>
      <p className="mt-1 text-[13px] text-muted">
        Wir haben einen 6-stelligen Code an Ihre Admin-E-Mail-Adresse geschickt. Bitte hier eintragen.
        Der Code ist 10 Minuten gültig.
      </p>
      <VerifyForm nextHref={sp.next ?? "/admin"} />
    </div>
  );
}
