// CBP-135 follow-up: shared JSON-LD renderer.
// Usage: <JsonLd data={someSchemaObject} />
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify is safe here — schema.org data is server-generated,
      // not raw user input, so no XSS risk via this dangerouslySetInnerHTML.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
