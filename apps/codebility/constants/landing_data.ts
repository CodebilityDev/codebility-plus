import {
  IconDiscord,
  IconFacebookWhite,
  IconLinkedInWhite,
} from "@/public/assets/svgs";

// Define types for each dataset
export interface AboutUsData {
  id: string;
  title: string;
  href: string;
}

export interface ConnectUsData {
  id: string;
  href: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export interface FeaturedSectionData {
  title: string;
  description: string;
  src: string;
  alt: string;
}

export interface ServicesCardData {
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
}

export interface MarketingCardData {
  title: string;
  description: string;
  url: string;
  category?: string;
}

export interface Service {
  id: string;
  title: string;
  starColor: "violet" | "teal"; // Limited to specific colors
}

// Data arrays with types applied
export const aboutUsData: AboutUsData[] = [
  { id: "1", title: "Services", href: "/services" },
  { id: "2", title: "Why Choose Us", href: "/#whychooseus" },
  { id: "3", title: "Our Admins", href: "/#admins" },
  { id: "4", title: "CoDevs", href: "/hire-a-codev" },
  { id: "5", title: "Projects", href: "/services" },
  { id: "6", title: "Contact", href: "mailto:codebility.dev@gmail.com" },
   {
    id: "7",     
    title: "Career",
    href: "/careers"
  }
];

export const connectUsData: ConnectUsData[] = [
  {
    id: "1",
    href: "https://www.facebook.com/Codebilitydev",
    icon: IconFacebookWhite,
  },
  {
    id: "2",
    href: "https://www.linkedin.com/company/codebilitytech",
    icon: IconLinkedInWhite,
  },
  { id: "3", href: "https://discord.gg/xhxumQ2dgF", icon: IconDiscord },
];

export const FeaturedSectiondata: FeaturedSectionData[] = [
  {
    title: "Learn Together",
    description:
      "Access workshops, tutorials, and mentorship. Enhance your skills with support from peers and experts.",
    src: "/assets/svgs/icon-graduation-hat-teal.svg",
    alt: "graduation hat",
  },
  {
    title: "Collaborate",
    description:
      "Work on exciting projects. Build your portfolio and solve real-world problems with fellow innovators.",
    src: "/assets/svgs/icon-team-teal.svg",
    alt: "team",
  },
  {
    title: "Innovate",
    description:
      "Explore new ideas and technologies. Contribute to groundbreaking projects and push the boundaries of what's possible.",
    src: "/assets/svgs/icon-skills.svg",
    alt: "skills",
  },
  {
    title: "Connect",
    description:
      "Engage with like-minded peers. Grow your network and collaborate on meaningful projects.",
    src: "/assets/svgs/icon-community-teal.svg",
    alt: "community",
  },
  {
    title: "Shape the Future",
    description:
      "Be part of a community shaping the future of tech. Together, we're driving tomorrow's breakthroughs.",
    src: "/assets/svgs/icon-suitcase-teal.svg",
    alt: "suitcase",
  },
  {
    title: "Inspire",
    description:
      "Motivate and be motivated. Share your journey and learn from the experiences of others.",
    src: "/assets/svgs/icon-diamond-teal.svg",
    alt: "diamond",
  },
];

export const ServicesCardData: ServicesCardData[] = [
  {
    title: "Content Quality",
    description:
      "High-quality content is the cornerstone of any successful website.",
    imageUrl:
      "https://codebility-cdn.pages.dev/assets/images/campaign/content-quality.png",
    imageAlt: "Content Quality",
  },
  {
    title: "Security",
    description:
      "By prioritizing security, we build trust with your users and protect your reputation.",
    imageUrl:
      "https://codebility-cdn.pages.dev/assets/images/campaign/security.png",
    imageAlt: "Security",
  },
  {
    title: "Analytics and Tracking",
    description:
      "Our analytics and tracking services provide you with in-depth insights into how users interact with your website.",
    imageUrl:
      "https://codebility-cdn.pages.dev/assets/images/index/feature3.jpg",
    imageAlt: "Analytics and Tracking",
  },
  {
    title: "Performance Optimization",
    description:
      "Our performance optimization services focus on enhancing your website's speed and responsiveness.",
    imageUrl:
      "https://codebility-cdn.pages.dev/assets/images/index/feature4.jpg",
    imageAlt: "Performance Optimization",
  },
  {
    title: "User Experience (UX) Design",
    description:
      "Effective UX design ensures that your website is intuitive and easy to navigate, enhancing user satisfaction and engagement.",
    imageUrl:
      "https://codebility-cdn.pages.dev/assets/images/index/feature5.jpg",
    imageAlt: "User Experience (UX) Design",
  },
  {
    title: "SEO (Search Engine Optimization)",
    description:
      "Achieving high visibility in search engine results is vital for attracting organic traffic.",
    imageUrl: "https://codebility-cdn.pages.dev/assets/images/campaign/seo.png",
    imageAlt: "SEO (Search Engine Optimization)",
  },
];

export const MarketingCardData: MarketingCardData[] = [
  {
    title: "AI Development",
    description:
      "Develop your personalized AI assistant or seamlessly integrate AI into your existing tech website.",
    url: "/ai-integration",
    category: "Technology",
  },
  {
    title: "Web App Development",
    description:
      "Discover the best in the industry and turn your ideas into powerful digital solutions.",
    url: "/services#web-application",
    category: "Engineering",
  },
  {
    title: "Mobile App Development",
    description:
      "Experience top-notch mobile app development with our expert team.",
    url: "/services#mobile-application",
    category: "Engineering",
  },
  {
    title: "Product Design",
    description:
      "Encounter excellence in development with our skilled team, masters of UI/UX design.",
    url: "/services#product-design",
    category: "Product",
  },
];

export const services: Service[] = [
  {
    id: "1",
    title: "Mobile Development",
    starColor: "violet",
  },
  {
    id: "2",
    title: "Digital Marketing",
    starColor: "teal",
  },
  {
    id: "3",
    title: "UI/UX Design",
    starColor: "violet",
  },
  {
    id: "4",
    title: "AI-Development",
    starColor: "teal",
  },
  {
    id: "5",
    title: "Web Development",
    starColor: "violet",
  },
  {
    id: "6",
    title: "Mobile Development",
    starColor: "teal",
  },
];
