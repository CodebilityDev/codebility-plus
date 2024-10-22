import pathsConfig from "@/config/paths.config";
// ====================================================================================

import {
  IconAngular,
  IconAWS,
  IconBootstrap,
  IconC,
  IconCPlusPlus,
  IconCSharp,
  IconCSS,
  IconDjango,
  IconFigma,
  IconFirebase,
  IconHTML,
  IconJava,
  IconJavaScript,
  IconJQuery,
  IconKotlin,
  IconMongoDB,
  IconMySQL,
  IconNextJS,
  IconNodeJS,
  IconPHP,
  IconPostgreSQL,
  IconPython,
  IconReact,
  IconReactNative,
  IconRuby,
  IconSolidity,
  IconSwift,
  IconTailwind,
  IconTypeScript,
  IconVue,
} from "@/public/assets/svgs";
import { Sidebar, SocialIcons } from "@/types";

export const pageSize = {
  codevsList: 10,
  applicants: 10,
  clients: 6,
  clientsArchive: 6,
  interns: 8,
  tasks: 9,
  weeklyTop: 10,
  projects: 6,
  services: 6,
} as const;

export const navLinks = [
  {
    name: "Home",
    href: "/#home",
  },
  {
    name: "About",
    href: "/#about",
  },
  {
    name: "CoDevs",
    href: "/#codevs",
  },
  {
    name: "Services",
    href: "/#services",
  },
  {
    name: "Projects",
    href: "/#projects",
  },
];

// ====================================================================================

export const socialIcons: SocialIcons[] = [
  {
    route: "#facebook",
    imgURL: "/assets/svgs/icon-facebook-white.svg",
    label: "facebook",
  },
  {
    route: "#twitter",
    imgURL: "/assets/svgs/icon-twitter.svg",
    label: "twitter",
  },
  {
    route: "https://github.com/Zeff01/codebility-fe/tree/main",
    imgURL: "/assets/svgs/icon-github.svg",
    label: "github",
  },
  {
    route: "#linkedin",
    imgURL: "/assets/svgs/icon-linkedin.svg",
    label: "linkedin",
  },
  {
    route: "#slack",
    imgURL: "/assets/svgs/icon-slack.svg",
    label: "slack",
  },
];

// ====================================================================================

export const sidebarData: Sidebar[] = [
  {
    id: "1",
    title: "Menu",
    links: [
      {
        route: pathsConfig.app.home,
        imgURL: "/assets/svgs/icon-dashboard.svg",
        label: "Dashboard",
        permission: "dashboard",
      },
      {
        route: pathsConfig.app.tasks,
        imgURL: "/assets/svgs/icon-task.svg",
        label: "My Tasks",
        permission: "tasks",
      },
      {
        route: pathsConfig.app.kanban,
        imgURL: "/assets/svgs/icon-kanban.svg",
        label: "Kanban",
        permission: "kanban",
      },
      {
        route: pathsConfig.app.time_tracker,
        imgURL: "/assets/svgs/icon-time-tracker.svg",
        label: "Time Tracker",
        permission: "time_tracker",
      },
    ],
  },
  {
    id: "2",
    title: "Codevs",
    links: [
      {
        route: pathsConfig.app.interns,
        imgURL: "/assets/svgs/icon-interns.svg",
        label: "Interns",
        permission: "interns",
      },
      {
        route: pathsConfig.app.orgchart,
        imgURL: "/assets/svgs/icon-org-chart.svg",
        label: "Org Chart",
        permission: "orgchart",
      },
    ],
  },
  {
    id: "3",
    title: "Management",
    links: [
      {
        route: pathsConfig.app.applicants,
        imgURL: "/assets/svgs/icon-applicant.svg",
        label: "Applicants",
        permission: "applicants",
      },
      {
        route: pathsConfig.app.in_hose,
        imgURL: "/assets/svgs/icon-applicant2.svg",
        label: "In-House",
        permission: "in_house",
      },
      {
        route: pathsConfig.app.clients,
        imgURL: "/assets/svgs/icon-clients.svg",
        label: "Clients",
        permission: "clients",
      },
      {
        route: pathsConfig.app.projects,
        imgURL: "/assets/svgs/icon-projects.svg",
        label: "Projects",
        permission: "projects",
      },
      {
        route: pathsConfig.app.settings,
        imgURL: "/assets/svgs/icon-cog.svg",
        label: "Settings",
        permission: "settings",
      },
    ],
  },
];

// ====================================================================================

export const taskPrioLevels = [
  "CRITICAL",
  "HIGHEST",
  "HIGH",
  "MEDIUM",
  "LOW",
] as const;

// ====================================================================================

export const categories = ["FE", "BE", "MD", "UI"] as const;

// ====================================================================================

export const taskTypes = ["BUG", "REFACTOR", "FEATURE", "PERF"] as const;

// ====================================================================================

export const aboutLinks = [
  {
    label: "What We Do",
    url: "/",
  },
  {
    label: "Meet Our CoDevs",
    url: "#codevs",
  },
  {
    label: "Our Services",
    url: "/services",
  },
];

// ====================================================================================

export const servicesCardData = [
  {
    icon: "icon-web-app",
    title: "Web App Development",
    desc: "We build tailor-made web applications to suit your business needs, leveraging the latest technologies in backend and frontend development. Our solutions are scalable, secure, and designed for high performance, ensuring a seamless user experience across all devices.",
  },
  {
    icon: "icon-mobile-app",
    title: "Mobile App Development",
    desc: "Our team creates engaging and intuitive mobile applications for both iOS and Android platforms. From conceptualization to deployment, we ensure your app meets market demands, enhances user engagement, and aligns with your business objectives.",
  },
  {
    icon: "icon-uiux",
    title: "UI/UX Design Services",
    desc: "We offer comprehensive UI/UX design services to create visually appealing and user-friendly interfaces for your applications. Our designs are focused on enhancing user experience, increasing user retention, and making navigation intuitive across all digital platforms.",
  },
  {
    icon: "icon-digital-marketing",
    title: "Digital Marketing Solutions",
    desc: "Amplify your online presence with our digital marketing services. We specialize in SEO, PPC, content marketing, social media marketing, and email marketing to help you reach your target audience, engage potential customers, and drive conversions.",
  },
  {
    icon: "icon-cart",
    title: "E-commerce Solutions",
    desc: "Launch or enhance your online store with our e-commerce development services. We offer custom e-commerce website development, shopping cart solutions, and payment gateway integration, ensuring a smooth shopping experience for your customers.",
  },
  {
    icon: "icon-cloud",
    title: "Cloud Computing Services",
    desc: "Migrate your applications to the cloud for enhanced scalability, flexibility, and cost-effectiveness. We provide cloud application development, deployment, and management services, leveraging platforms like AWS, Azure, and Google Cloud.",
  },
  {
    icon: "icon-team",
    title: "Dedicated Development Teams",
    desc: "Extend your in-house team with our dedicated development professionals. Whether you need additional expertise for a specific project or long-term support, our skilled developers seamlessly integrate with your team to help you achieve your development goals.",
  },
  {
    icon: "icon-verified",
    title: "Quality Assurance and Testing",
    desc: "Ensure the reliability and performance of your applications with our comprehensive QA and testing services. We offer manual and automated testing, performance testing, and security audits to identify and fix vulnerabilities, ensuring your software is bug-free and secure.",
  },
];

// ====================================================================================

export const siteLinks = [
  {
    label: "Contact Us",
    url: "/contact-us",
  },
  {
    label: "Privacy Policy",
    url: "#privacy-policy",
  },
  {
    label: "Terms of Service",
    url: "#terms-of-service",
  },
];

// ====================================================================================

export const profilePronoun = ["He/Him", "She/Her", "They/Them"];

// ====================================================================================

export const positions = [
  "Frontend Developer",
  "Backend Developer",
  "Fullstack Developer",
  "Mobile Developer",
  "UI/UX Designer",
  "Graphic Designer",
  "Project Manager",
  "Human Resource",
  "Social Media Manager",
  "Digital Marketer",
  "Video Editor",
];

// ====================================================================================

export const techstacks = [
  { name: "Angular", icon: IconAngular },
  { name: "AWS", icon: IconAWS },
  { name: "Bootstrap", icon: IconBootstrap },
  { name: "C", icon: IconC },
  { name: "C++", alias: "cplus-plus", icon: IconCPlusPlus },
  { name: "CSharp", icon: IconCSharp },
  { name: "CSS", icon: IconCSS },
  { name: "Django", icon: IconDjango },
  { name: "Figma", icon: IconFigma },
  { name: "Firebase", icon: IconFirebase },
  { name: "HTML", icon: IconHTML },
  { name: "Java", icon: IconJava },
  { name: "JavaScript", icon: IconJavaScript },
  { name: "JQuery", icon: IconJQuery },
  { name: "Kotlin", icon: IconKotlin },
  { name: "MongoDB", icon: IconMongoDB },
  { name: "MySQL", icon: IconMySQL },
  { name: "NextJS", icon: IconNextJS },
  { name: "NodeJS", icon: IconNodeJS },
  { name: "PHP", icon: IconPHP },
  { name: "PostgreSQL", icon: IconPostgreSQL },
  { name: "Python", icon: IconPython },
  { name: "React", icon: IconReact },
  { name: "ReactNative", alias: "react-native", icon: IconReactNative },
  { name: "Ruby", icon: IconRuby },
  { name: "Solidity", icon: IconSolidity },
  { name: "Swift", icon: IconSwift },
  { name: "Tailwind", icon: IconTailwind },
  { name: "TypeScript", icon: IconTypeScript },
  { name: "Vue", icon: IconVue },
];

// ====================================================================================

export const projects = [
  {
    id: 1,
    name: "Tap Up",
    desc: "Tap Up was carefully designed by our team from scratch. We incorporated cutting-edge technology into our cards to guarantee seamless connections. Our commitment to innovation provides a user-friendly experience, allowing you to easily access meaningful opportunities.",
    image: "slider-tapup.gif",
    logo: "logo-tapup-light.svg",
    link: "https://tapup.vercel.app/",
  },
];
// ====================================================================================
export const services = [
  {
    number: "01",
    label: "Web Development",
  },
  {
    number: "02",
    label: "Mobile Development",
  },
  {
    number: "03",
    label: "UI/UX Design",
  },
  {
    number: "04",
    label: "Digital Marketing",
  },
];

export const navItems = [
  {
    id: "1",
    title: "Our Services",
    path: "/services",
  },
  {
    id: "2",
    title: "About Us",
    path: "/#whychooseus",
  },
  {
    id: "3",
    title: "Book a Call",
    path: "/bookacall",
  },
  {
    id: "4",
    title: "Hire a CoDevs",
    path: "/codevs",
  },
  {
    id: "5",
    title: "Sign In",
    path: "/authv2/sign-in",
  },
  {
    id: "6",
    title: "Sign Up",
    path: "/authv2/sign-up",
  },
];

export const permissionsString = `
  roles,
  kanban,
  clients,
  interns,
  tasks,
  in_house,
  projects,
  services,
  dashboard,
  applicants,
  permissions,
  time_tracker
` as const;