interface footerLinksType {
  id: string;
  title: string;
  href: string;
}

export const aboutLinks = [
  { label: "What We Do", url: "/" },
  { label: "Meet Our CoDevs", url: "#codevs" },
  { label: "Our Services", url: "/services" },
];

export const siteLinks = [
  { label: "Contact Us", url: "/contact-us" },
  { label: "Privacy Policy", url: "#privacy-policy" },
  { label: "Terms of Service", url: "#terms-of-service" },
];

export const footerLinks = [
  { id: "1", title: "Terms & Condition", href: "homeTermsAndConditionModal" },
  { id: "2", title: "Privacy Policy", href: "homePrivacyPolicyModal" },
  { id: "3", title: "FAQs", href: "homeFAQSModal" },
];
