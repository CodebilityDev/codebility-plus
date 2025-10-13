// File: /constants/techstack.ts
import {
  IconAngular,
  IconApache,
  IconASPNet,
  IconAWS,
  IconAzure,
  IconBootstrap,
  IconC,
  IconCloudflare,
  IconCPlusPlus,
  IconCSharp,
  IconCSS,
  IconDigitalOcean,
  IconDjango,
  IconDocker,
  IconDynamoDB,
  IconExpressJs,
  IconFastAPI,
  IconFigma,
  IconFirebase,
  IconFlask,
  IconFlutter,
  IconGCP,
  IconGit,
  IconGitHubActions,
  IconGraphQL,
  IconHeroku,
  IconHTML,
  IconJava,
  IconJavaScript,
  IconJenkins,
  IconJoomla,
  IconJQuery,
  IconKotlin,
  IconKubernetes,
  IconLaravel,
  IconMongoDB,
  IconMUI,
  IconMySQL,
  IconNetlify,
  IconNextJS,
  IconNginx,
  IconNodeJS,
  IconNuxtJS,
  IconOracle,
  IconPHP,
  IconPostgreSQL,
  IconPython,
  IconRails,
  IconReact,
  IconReactNative,
  IconRedis,
  IconRuby,
  IconRust,
  IconShadcnUI,
  IconShopify,
  IconSolidity,
  IconSpringBoot,
  IconSQLite,
  IconSvelte,
  IconSvelteKit,
  IconSwift,
  IconTailwind,
  IconTypeScript,
  IconVercel,
  IconVite,
  IconVue,
  IconWebpack,
  IconWordPress,
} from "@/public/assets/svgs/techstack";

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
  { name: "SvelteKit", icon: IconSvelteKit, category: "Frontend" },
  { name: "Nuxt.js", icon: IconNuxtJS, category: "Frontend" },
  { name: "MUI", icon: IconMUI, category: "Frontend" },
  { name: "ShadcnUI", icon: IconShadcnUI, category: "Frontend" },

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
  { name: "Oracle", icon: IconOracle, category: "Backend" },
  { name: "Java", icon: IconJava, category: "Backend" },
  
  // Additional Databases
  { name: "SQLite", icon: IconSQLite, category: "Backend" },
  { name: "Redis", icon: IconRedis, category: "Backend" },
  { name: "DynamoDB", icon: IconDynamoDB, category: "Backend" },
  
  // Additional Backend Frameworks
  { name: "Laravel", icon: IconLaravel, category: "Backend" },
  { name: "Flask", icon: IconFlask, category: "Backend" },
  { name: "FastAPI", icon: IconFastAPI, category: "Backend" },
  { name: "Ruby on Rails", alias: "rails", icon: IconRails, category: "Backend" },
  { name: "Spring Boot", alias: "springboot", icon: IconSpringBoot, category: "Backend" },
  { name: "ASP.NET Core", alias: "aspnet", icon: IconASPNet, category: "Backend" },

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
  { name: "Google Cloud Platform", alias: "gcp", icon: IconGCP, category: "Server" },
  { name: "Microsoft Azure", alias: "azure", icon: IconAzure, category: "Server" },
  { name: "Vercel", icon: IconVercel, category: "Server" },
  { name: "Netlify", icon: IconNetlify, category: "Server" },
  { name: "Heroku", icon: IconHeroku, category: "Server" },
  { name: "DigitalOcean", icon: IconDigitalOcean, category: "Server" },
  { name: "Cloudflare", icon: IconCloudflare, category: "Server" },
  { name: "Kubernetes", icon: IconKubernetes, category: "Server" },
  { name: "Git", icon: IconGit, category: "Server" },
  { name: "GitHub Actions", icon: IconGitHubActions, category: "Server" },
  { name: "Jenkins", icon: IconJenkins, category: "Server" },
  { name: "Nginx", icon: IconNginx, category: "Server" },
  { name: "Apache", icon: IconApache, category: "Server" },
  { name: "Webpack", icon: IconWebpack, category: "Server" },
  { name: "Vite", icon: IconVite, category: "Server" },

  // CMS / Ecommerce
  { name: "WordPress", icon: IconWordPress, category: "CMS" },
  { name: "Shopify", icon: IconShopify, category: "CMS" },
  { name: "Joomla", icon: IconJoomla, category: "CMS" },

  // Design (or Other)
  { name: "Figma", icon: IconFigma, category: "Design" },
];
