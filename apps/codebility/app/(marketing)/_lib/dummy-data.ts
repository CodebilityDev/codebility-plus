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

export const FeaturedSectiondata = [
  {
    title: "Learn Together",
    description: "Access workshops, tutorials, and mentorship. Enhance your skills with support from peers and experts.",
    src: "/assets/svgs/icon-graduation-hat-teal.svg",
    alt: "graduation hat",
  },
  {
    title: "Collaborate",
    description: "Work on exciting projects. Build your portfolio and solve real-world problems with fellow innovators.",
    src: "/assets/svgs/icon-team-teal.svg",
    alt: "team",
  },
  {
    title: "Innovate",
    description: "Explore new ideas and technologies. Contribute to groundbreaking projects and push the boundaries of what's possible.",
    src: "/assets/svgs/icon-skills.svg",
    alt: "skills",
  },
  {
    title: "Join Us",
    description: "Become part of a dynamic community of future developers and designers. ",
    src: "/assets/svgs/icon-community-teal.svg",
    alt: "community",
  },
  {
    title: "Shape the Future",
    description: "Be part of a community shaping the future of tech. Together, we're driving tomorrow's breakthroughs.",
    src: "/assets/svgs/icon-suitcase-teal.svg",
    alt: "suitcase",
  },
  {
    title: "Inspire",
    description: "Motivate and be motivated. Share your journey and learn from the experiences of others.",
    src: "/assets/svgs/icon-diamond-teal.svg",
    alt: "diamond",
  },
]