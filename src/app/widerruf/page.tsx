import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { LegalDisclaimer } from "@/components/legal-disclaimer";
import { LegalProse } from "@/components/legal-prose";
import { LegalSectionCard } from "@/components/legal-section-card";
import { buildPublicPageMetadata } from "@/lib/seo-page-meta";

export const metadata: Metadata = buildPublicPageMetadata({
  path: "/widerruf",
  title: "Widerrufsrecht",
  description: `Widerrufsbelehrung für ${brand.name}: Frist, Formular, Folgen des Widerrufs, Rücksendung und Eingangsprüfung vor Erstattung — Verweis auf die AGB.`,
  keywords: ["Widerruf", "Widerrufsrecht", "Rücksendung", "Verbraucher"],
  category: "legal",
});

export default function WiderrufPage() {
  return (
    <LegalProse title="Widerrufsbelehrung & Widerrufsformular">
      <LegalDisclaimer />
      <p>
        Die folgenden Informationen richten sich an <strong>Verbraucher</strong> im Sinne des Gesetzes, denen ein
        Widerrufsrecht zusteht. Ergänzend gelten unsere{" "}
        <Link href="/agb" className="font-medium text-tint underline">
          AGB
        </Link>{" "}
        (insbesondere zu Rücksendung und Eingangsprüfung, siehe dort <strong>§ 6</strong>).
      </p>

      <h2>Widerrufsrecht</h2>
      <p>
        Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. Die
        Widerrufsfrist beträgt vierzehn Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter Dritter, der nicht der
        Beförderer ist, die Waren in Besitz genommen haben bzw. hat.
      </p>
      <p>
        Um Ihr Widerrufsrecht auszuüben, müssen Sie uns ({brand.legalName}, {brand.addressLine1}, {brand.zip}{" "}
        {brand.city}, E-Mail: {brand.email}) mittels einer eindeutigen Erklärung (z.&nbsp;B. ein mit der Post
        versandter Brief oder E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Sie können
        dafür das beigefügte Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.
      </p>
      <p>
        Zur Wahrung der Widerrufsfrist reicht es aus, dass die Mitteilung über die Ausübung des Widerrufsrechts vor
        Ablauf der Widerrufsfrist abgesendet wird.
      </p>

      <h2>Folgen des Widerrufs</h2>
      <p>
        Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben,
        einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen Kosten, die sich daraus ergeben, dass Sie eine
        andere Art der Lieferung als die von uns angebotene, günstigste Standardlieferung gewählt haben), unverzüglich
        und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf bei
        uns eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen
        Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart.
      </p>
      <p>
        Wir können die Rückzahlung verweigern, bis wir die Waren wieder zurückerhalten haben oder bis Sie den Nachweis
        erbracht haben, dass Sie die Waren zurückgesandt haben, je nachdem, welches der frühere Zeitpunkt ist.
      </p>
      <p>
        Sie haben die Waren unverzüglich und in jedem Fall spätestens binnen vierzehn Tagen ab dem Tag, an dem Sie uns
        über den Widerruf dieses Vertrags unterrichten, an uns zurückzusenden oder zu übergeben. Die Frist ist gewahrt,
        wenn Sie die Waren vor Ablauf der Frist von vierzehn Tagen absenden.
      </p>
      <p>Sie tragen die unmittelbaren Kosten der Rücksendung der Waren.</p>

      <div className="not-prose mt-4 space-y-4">
        <LegalSectionCard title="Rücksendung und Prüfung vor Auszahlung" id="widerruf-pruefung">
          <p>
            Unabhängig von den gesetzlichen Fristen bearbeiten wir Rücksendungen sachgerecht: Nach{" "}
            <strong>Eingang der Ware</strong> führen wir eine <strong>Eingangsprüfung</strong> durch (u.&nbsp;a.
            Vollständigkeit, Übereinstimmung mit der Bestellung, unversehrte Versiegelung/Originalverpackung, Kennzeichnung).
          </p>
          <p>
            Eine <strong>verifizierte Rückerstattung</strong> setzt voraus, dass die Prüfung ohne Beanstandung abgeschlossen
            werden kann. Liegen gesetzliche oder sachliche Gründe vor, die einer vollen Erstattung entgegenstehen (z.&nbsp;B.
            Verletzung der Rücknahmevoraussetzungen, erkennbare Manipulation, gesundheitlich bedenkliche Öffnung
            versiegelter Ware), teilen wir Ihnen das Ergebnis in Textform mit; gesetzliche Ansprüche bleiben unberührt.
          </p>
          <p>
            Details zu Anmeldung, Adresse und weiteren Voraussetzungen finden Sie in den{" "}
            <Link href="/agb#agb-eingangspruefung" className="font-medium text-tint underline">
              AGB (§ 6, Eingangsprüfung)
            </Link>
            .
          </p>
        </LegalSectionCard>
      </div>

      <h2>Widerrufsformular</h2>
      <p>Wenn Sie den Vertrag widerrufen wollen, füllen Sie bitte dieses Formular aus und senden Sie es zurück.</p>
      <p>
        An: {brand.legalName}, {brand.addressLine1}, {brand.zip} {brand.city}, E-Mail: {brand.email}
      </p>
      <p>
        Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über den Kauf der folgenden Waren
        (*)/die Erbringung der folgenden Dienstleistung (*)
      </p>
      <p>Bestellt am (*)/erhalten am (*): _________________________</p>
      <p>Name des/der Verbraucher(s): _________________________</p>
      <p>Anschrift des/der Verbraucher(s): _________________________</p>
      <p>Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier): _________________________</p>
      <p>Datum: _________________________</p>
      <p>(*) Unzutreffendes streichen.</p>

      <h2>Vorzeitiges Erlöschen des Widerrufsrechts</h2>
      <p>
        Das Widerrufsrecht kann bei Waren, die schnell verderben oder deren Verfallsdatum schnell überschritten wäre,
        erlöschen sowie bei versiegelten Waren, die aus Gründen der Gesundheitshygiene oder -schutz nicht zur
        Rückgabe geeignet sind, wenn ihre Versiegelung nach der Lieferung entfernt wurde, und in den weiteren
        gesetzlich vorgesehenen Fällen.
      </p>
    </LegalProse>
  );
}
