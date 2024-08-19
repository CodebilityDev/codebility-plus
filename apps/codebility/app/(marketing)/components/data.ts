import { footer_AboutUsLinksT, footer_CompanyModalT, footer_ConnectUsSocialsT } from "@/types/home"
import { IconDiscord, IconFacebookWhite, IconLinkedInWhite } from "@/public/assets/svgs"

export const companyData: footer_CompanyModalT[] = [
  { id: "1", title: "Terms & Condition", href: "homeTermsAndConditionModal" },
  { id: "2", title: "Privacy Policy", href: "homePrivacyPolicyModal" },
  { id: "3", title: "FAQs", href: "homeFAQSModal" },
]

export const aboutUsData: footer_AboutUsLinksT[] = [
  { id: "1", title: "Services", href: "/services" },
  { id: "2", title: "Why Choose Us", href: "/#whychooseus" },
  { id: "3", title: "Our Admins", href: "/#admins" },
  { id: "4", title: "CoDevs", href: "/codevs" },
  { id: "5", title: "Projects", href: "/services" },
  { id: "6", title: "Contact", href: "mailto:codebility.dev@gmail.com" },
]

export const connectUsData: footer_ConnectUsSocialsT[] = [
  { id: "1", href: "https://www.facebook.com/Codebilitydev", icon: IconFacebookWhite },
  { id: "2", href: "https://www.linkedin.com/company/codebilitytech", icon: IconLinkedInWhite },
  { id: "3", href: "https://discord.gg/xhxumQ2dgF", icon: IconDiscord },
]
