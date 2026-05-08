import Link from "next/link";
import { InquirySkuResolver } from "@/app/anfrage/inquiry-sku-resolver";
import { anfrageReassuranceBullets } from "@/lib/institutional-copy";

export default function InquiryPage() {
  return (
    <div className="mx-auto max-w-2xl page-gutter-x py-10 sm:py-14 md:py-16">
      <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-tint">B2B · RUO</p>
      <h1 className="mt-2 text-[24px] font-semibold leading-tight tracking-tight text-foreground sm:text-[30px] md:text-[36px]">
        Institutionelle Anfrage
      </h1>
      <p className="mt-4 text-[14px] leading-relaxed text-muted sm:text-[15px]">
        Kein Verkauf ohne Prüfung. Mit Absenden erklären Sie die Forschungsverwendung und unsere{" "}
        <Link href="/forschungsbedingungen-b2b" className="font-medium text-tint hover:underline">
          B2B-Forschungsbedingungen
        </Link>
        . Es erfolgt keine automatische Rechnung oder Zahlungsauslösung auf dieser Website.
      </p>
      <ul className="mt-6 space-y-2 rounded-[18px] border border-hairline bg-surface px-4 py-4 text-[14px] leading-relaxed text-muted sm:px-5">
        {anfrageReassuranceBullets.map((line) => (
          <li key={line} className="flex gap-2">
            <span className="mt-2 size-1 shrink-0 rounded-full bg-tint" aria-hidden />
            <span>{line}</span>
          </li>
        ))}
      </ul>
      <div className="mt-10">
        <InquirySkuResolver />
      </div>
    </div>
  );
}
