import type { Metadata } from "next";
import { brand } from "@/lib/brand";
import { LegalProse } from "@/components/legal-prose";
import { LegalDisclaimer } from "@/components/legal-disclaimer";

export const metadata: Metadata = {
  title: "Impressum",
};

export default function ImpressumPage() {
  return (
    <LegalProse title="Impressum">
      <LegalDisclaimer />
      <p>
        <strong>Angaben gemäß § 5 TMG / § 18 MStV</strong>
      </p>
      <p>
        {brand.name}
        <br />
        {brand.legalFormDisplay} · Inhaber: {brand.managingDirector}
        <br />
        {brand.addressLine1}
        <br />
        {brand.zip} {brand.city}
        <br />
        {brand.country}
      </p>
      <h2>Kontakt</h2>
      <p>
        {brand.phoneDisplay.trim() ? (
          <>
            Telefon: {brand.phoneDisplay}
            <br />
          </>
        ) : null}
        E-Mail:{" "}
        <a href={`mailto:${brand.email}`} className="text-tint">
          {brand.email}
        </a>
        <br />
        Web:{" "}
        <a href={brand.origin} className="text-tint">
          {brand.origin}
        </a>
      </p>
      <h2>Handelsregister / Gewerbe</h2>
      <p>{brand.registerNote}</p>
      <h2>Umsatzsteuer</h2>
      <p>{brand.vatNotice}</p>
      <h2>EU-Streitschlichtung</h2>
      <p>
        Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
        <a href="https://ec.europa.eu/consumers/odr/" rel="noopener noreferrer">
          https://ec.europa.eu/consumers/odr/
        </a>
        . Unsere E-Mail-Adresse finden Sie oben im Impressum.
      </p>
      <h2>Verbraucherstreitbeilegung / Universalschlichtungsstelle</h2>
      <p>
        Wir sind zur Teilnahme an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
        nicht verpflichtet und hierzu nicht bereit.
      </p>

      <h2>Haftung für Inhalte</h2>
      <p>
        Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den
        allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht
        verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu
        forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der
        Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche
        Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei
        Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
      </p>

      <h2>Haftung für Links</h2>
      <p>
        Unser Angebot enthält ggf. Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben.
        Deshalb können wir für diese fremden Inhalte keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten
        ist stets der jeweilige Anbieter oder Betreiber verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der
        Verlinkung auf mögliche Rechtsverstöße überprüft; rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung
        nicht erkennbar. Eine permanente inhaltliche Kontrolle ohne konkrete Anhaltspunkte ist nicht zumutbar. Bei
        Bekanntwerden von Rechtsverletzungen entfernen wir derartige Links umgehend.
      </p>

      <h2>Urheberrecht</h2>
      <p>
        Die durch {brand.legalName} erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen
        Urheberrecht. Vervielfältigung, Bearbeitung, Verbreitung oder sonstige Verwertung außerhalb der Grenzen des
        Urheberrechts bedürfen der vorherigen schriftlichen Zustimmung der jeweils Berechtigten. Soweit Inhalte nicht
        vom Betreiber erstellt wurden, werden die Rechte Dritter beachtet und entsprechend gekennzeichnet. Sollten Sie
        dennoch auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um Hinweis; wir entfernen derartige
        Inhalte bei Bekanntwerden umgehend.
      </p>
    </LegalProse>
  );
}
