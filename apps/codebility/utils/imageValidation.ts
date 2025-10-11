// List of allowed image domains from next.config.mjs
const ALLOWED_DOMAINS = [
  "kdkuljweiqtiveqvqirw.supabase.co",
  "nwpvsxbrftplvebseaas.supabase.co",
  "qqjfmtpmprefkqneerkg.supabase.co",
  "qwmazrujcjuhhdipnywa.supabase.co",
  "hibnlysaokybrsufrdwp.supabase.co",
  "mynmukpnttyyjimymgrk.supabase.co",
  "res.cloudinary.com",
  "lh3.googleusercontent.com",
  "images.unsplash.com",
  "codebility-cdn.pages.dev",
];

/**
 * Validates if an image URL is allowed by Next.js Image component
 * @param url - The image URL to validate
 * @returns true if the URL is valid and allowed, false otherwise
 */
export function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    
    // Check if hostname is in allowed domains
    return ALLOWED_DOMAINS.some(domain => hostname === domain || hostname.endsWith(`.${domain}`));
  } catch {
    // Invalid URL
    return false;
  }
}

/**
 * Returns the image URL if valid, otherwise returns null
 * @param url - The image URL to validate
 * @returns The URL if valid, null otherwise
 */
export function getValidImageUrl(url: string | null | undefined): string | null {
  return isValidImageUrl(url) ? url! : null;
}