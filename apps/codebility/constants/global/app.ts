// CBP-135 follow-up: sitewide Organization + WebSite JSON-LD.
// Static schema — no data dependency, safe to render on every page.
export const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Codebility",
    url: "https://www.codebility.tech",
    logo: "https://www.codebility.tech/assets/images/logo.png",
    description: "Everyone has the ability to code",
};

export const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Codebility",
    url: "https://www.codebility.tech",
};

export const BASE_URL = "https://www.codebility.tech";
