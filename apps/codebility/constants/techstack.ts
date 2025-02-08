// File: /constants/techstack.ts
import {
  IconAngular,
  IconAWS,
  IconBootstrap,
  IconC,
  IconCPlusPlus,
  IconCSharp,
  IconCSS,
  IconDjango,
  IconDocker,
  IconExpressJs,
  IconFigma,
  IconFirebase,
  IconFlutter,
  IconGraphQL,
  IconHTML,
  IconJava,
  IconJavaScript,
  IconJoomla,
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
  IconRust,
  IconShopify,
  IconSolidity,
  IconSvelte,
  IconSwift,
  IconTailwind,
  IconTypeScript,
  IconVue,
  IconWordPress,
} from "@/public/assets/svgs";

/*
  We add a category property to each tech stack item.
  Suggested categories:
  - Frontend: UI frameworks and libraries for building client-side apps.
  - Backend: Server frameworks, languages and related tools.
  - Mobile: Tools for mobile development.
  - Blockchain: Blockchain development frameworks.
  - Server: DevOps and server tools.
  - CMS: Content management / ecommerce platforms.
  - Design: Tools used for design.
*/

export const techstacks = [
  // Frontend
  { name: "Angular", icon: IconAngular, category: "Frontend" },
  { name: "Bootstrap", icon: IconBootstrap, category: "Frontend" },
  { name: "CSS", icon: IconCSS, category: "Frontend" },
  { name: "HTML", icon: IconHTML, category: "Frontend" },
  { name: "JavaScript", icon: IconJavaScript, category: "Frontend" },
  { name: "JQuery", icon: IconJQuery, category: "Frontend" },
  { name: "NextJS", icon: IconNextJS, category: "Frontend" },
  { name: "React", icon: IconReact, category: "Frontend" },
  { name: "Tailwind", icon: IconTailwind, category: "Frontend" },
  { name: "TypeScript", icon: IconTypeScript, category: "Frontend" },
  { name: "Vue", icon: IconVue, category: "Frontend" },
  { name: "Svelte", icon: IconSvelte, category: "Frontend" },

  // Backend
  { name: "AWS", icon: IconAWS, category: "Backend" },
  { name: "Django", icon: IconDjango, category: "Backend" },
  { name: "Firebase", icon: IconFirebase, category: "Backend" },
  { name: "NodeJS", icon: IconNodeJS, category: "Backend" },
  { name: "PHP", icon: IconPHP, category: "Backend" },
  { name: "PostgreSQL", icon: IconPostgreSQL, category: "Backend" },
  { name: "Python", icon: IconPython, category: "Backend" },
  { name: "ExpressJS", icon: IconExpressJs, category: "Backend" },
  { name: "GraphQL", icon: IconGraphQL, category: "Backend" },
  { name: "Ruby", icon: IconRuby, category: "Backend" },
  { name: "Rust", icon: IconRust, category: "Backend" },
  { name: "C", icon: IconC, category: "Backend" },
  {
    name: "C++",
    alias: "cplus-plus",
    icon: IconCPlusPlus,
    category: "Backend",
  },
  { name: "CSharp", icon: IconCSharp, category: "Backend" },
  { name: "MongoDB", icon: IconMongoDB, category: "Backend" },
  { name: "MySQL", icon: IconMySQL, category: "Backend" },
  { name: "Java", icon: IconJava, category: "Backend" },

  // Mobile
  {
    name: "ReactNative",
    alias: "react-native",
    icon: IconReactNative,
    category: "Mobile",
  },
  { name: "Flutter", icon: IconFlutter, category: "Mobile" },
  { name: "Kotlin", icon: IconKotlin, category: "Mobile" },
  { name: "Swift", icon: IconSwift, category: "Mobile" },

  // Blockchain
  { name: "Solidity", icon: IconSolidity, category: "Blockchain" },

  // Server / DevOps
  { name: "Docker", icon: IconDocker, category: "Server" },

  // CMS / Ecommerce
  { name: "WordPress", icon: IconWordPress, category: "CMS" },
  { name: "Shopify", icon: IconShopify, category: "CMS" },
  { name: "Joomla", icon: IconJoomla, category: "CMS" },

  // Design (or Other)
  { name: "Figma", icon: IconFigma, category: "Design" },
];
