
import DOMPurify from "dompurify";

export function sanitizeHtml(html?: string | null): string {
  if (!html) return "";

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p",
      "br",

      "strong",
      "b",
      "em",
      "i",
      "u",
      "s",

      "ul",
      "ol",
      "li",

      "blockquote",
      "code",
      "pre",

      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",

      "a",

      "span",
      "div"
    ],

    ALLOWED_ATTR: [
      "href",
      "target",
      "rel"
    ],

    ALLOW_DATA_ATTR: false
  });
}