// CBP-135 follow-up: shared JSON-LD renderer.
// Usage: <JsonLd data={someSchemaObject} />
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Escaping "<" prevents stored XSS: several schema fields (profile bio,
      // job descriptions) are user-editable, so JSON.stringify alone isn't
      // enough — it escapes quotes but not "<", letting a value like
      // "</script><script>alert(1)</script>" break out of this tag and run
      // on a public page with no login required. "\u003c" is valid JSON and
      // parses back to "<", so schema.org validators (e.g. Google's Rich
      // Results tool) still read it correctly.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}