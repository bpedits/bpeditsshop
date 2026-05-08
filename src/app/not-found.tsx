import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg page-gutter-x py-16 text-center sm:py-24">
      <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-muted">404</p>
      <h1 className="mt-3 text-[28px] font-semibold tracking-tight text-foreground">Seite nicht gefunden</h1>
      <p className="mt-2 text-[15px] text-muted">Der Inhalt existiert nicht oder wurde verschoben.</p>
      <Link
        href="/"
        className="mt-10 inline-flex min-h-11 items-center justify-center rounded-full bg-tint px-8 text-[15px] font-medium text-white transition hover:opacity-90"
      >
        Zur Startseite
      </Link>
    </div>
  );
}
