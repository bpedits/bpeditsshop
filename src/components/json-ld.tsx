type Props = { data: Record<string, unknown> };

/** Strukturierte Daten — ein Objekt pro `<script>` (valides JSON-LD). */
export function JsonLd({ data }: Props) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
