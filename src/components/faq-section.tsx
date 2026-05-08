const faqs: { q: string; a: string }[] = [
  {
    q: "Für wen ist der Katalog gedacht?",
    a: "Für professionelle Forschungseinrichtungen, Biotech, CROs und vergleichbare Labore. Es handelt sich um einen öffentlich einsehbaren Research-Use-Only-Katalog — kein Endverbraucher-Shop.",
  },
  {
    q: "Wie erhalte ich ein Angebot?",
    a: "Über „Institutionelle Anfrage“ oder den Button auf der Produktseite. Nach Prüfung (Pending Review) melden wir uns — es gibt keinen automatischen Kauf und keine Sofort-Zahlung auf dieser Website.",
  },
  {
    q: "Warum sind keine Preise sichtbar?",
    a: "Preise und kaufmännische Konditionen werden institutionell geklärt und nicht öffentlich ausgewiesen.",
  },
  {
    q: "Wie steht es um Datenschutz und Vertraulichkeit?",
    a: "Wir verarbeiten personenbezogene Daten nur soweit für die Anfragebearbeitung erforderlich und gemäß Datenschutzerklärung. Technische und organisatorische Maßnahmen dokumentieren Sie intern.",
  },
  {
    q: "Kann ich eine Analysebescheinigung (CoA) erhalten?",
    a: "Wo auf der Produktseite ausgewiesen, können CoA und/oder SDS im Rahmen Ihrer Bestellung bzw. nach interner Freigabe bereitgestellt werden — produkt- und chargeabhängig.",
  },
  {
    q: "Wohin liefert ihr?",
    a: "Liefergebiet und Logistik ergeben sich aus Angebot und regulatorischer Prüfung. Gefahrgut und Temperaturführung sind fallweise zu klären.",
  },
  {
    q: "Gibt es Drittlabor-Tests?",
    a: "Analytik kann intern oder extern erfolgen — nur belegbar kommunizieren, was für Ihre SKUs tatsächlich gilt.",
  },
  {
    q: "Handling und SOPs?",
    a: "Technische Unterlagen und SOP-bezogene Dokumentation können je nach Produkt separat angeboten werden. Juristische Prüfung liegt bei der einstellenden Organisation.",
  },
  {
    q: "Rahmenverträge und wiederkehrende Bedarfe?",
    a: "Bitte verweisen Sie in der Anfrage auf Abrufmengen und Referenzprojekte. Separate Einkaufskanäle (NDA, Lieferabruf) sind außerhalb dieses Formulars möglich.",
  },
];

function ChevronIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FaqSection() {
  return (
    <div className="space-y-3">
      {faqs.map((item) => (
        <details
          key={item.q}
          className="group rounded-[18px] border border-black/[0.06] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-[box-shadow,border-color] duration-300 ease-out open:border-black/[0.09] open:shadow-[0_8px_28px_-12px_rgba(0,0,0,0.1)] motion-reduce:transition-none"
        >
          <summary className="cursor-pointer list-none select-none px-4 py-3.5 text-[15px] font-semibold text-foreground marker:content-none outline-none [&::-webkit-details-marker]:hidden focus-visible:ring-2 focus-visible:ring-tint/30 focus-visible:ring-offset-2">
            <span className="flex items-start justify-between gap-3">
              <span className="min-w-0 pt-0.5">{item.q}</span>
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-black/[0.04] text-tint transition-[transform,background-color] duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-open:rotate-180 group-open:bg-tint/10 motion-reduce:transition-none">
                <ChevronIcon className="size-4" />
              </span>
            </span>
          </summary>
          {/*
            Grid 0fr → 1fr: sanfte Höhenanimation bei <details> (group-open = details[open]).
          */}
          <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-open:grid-rows-[1fr] motion-reduce:transition-none">
            <div className="min-h-0 overflow-hidden px-4">
              <div className="border-t border-black/[0.06] pb-4 pt-3 translate-y-1 opacity-0 transition-[opacity,transform] duration-200 ease-out group-open:translate-y-0 group-open:opacity-100 group-open:delay-75 group-open:duration-300 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none">
                <p className="text-[14px] leading-relaxed text-muted">{item.a}</p>
              </div>
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}
