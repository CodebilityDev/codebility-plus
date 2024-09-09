import {
  customWebDev,
  responsiveDesign,
  seo,
} from "@/public/assets/images/ai-integration";
import {
  customAppDevelopment,
  enterpriseSolution,
  userCentricDesign,
} from "@/public/assets/images/services";
import { Edge, Node } from "reactflow";

export const partnerData = [
  {
    id: "1",
    title: "Expertise in Modern Tech",
    description:
      "We use the latest technologies to build dynamic websites and mobile apps tailored to your needs.",
  },
  {
    id: "2",
    title: "Custom Solutions",
    description:
      "We provide personalized development services to ensure your project meets your specific business goals.",
  },
  {
    id: "3",
    title: "Comprehensive Service",
    description:
      "From design to maintenance, we handle every aspect of development, making the process seamless for you.",
  },
  {
    id: "4",
    title: "AI Integration",
    description:
      "Enhance your digital products with our advanced AI solutions for better performance and user experience.",
  },
];

export const developmentProcessData = [
  {
    id: "1",
    title: "Discovery Phase",
    process: ["Initial Consultation", "Research and Analysis"],
  },
  {
    id: "2",
    title: "Planning Phase",
    process: ["Project Scope", "Information Architecture"],
  },
  {
    id: "3",
    title: "Design Phase",
    process: ["Visual Design", "User Experience (UX) Design"],
  },
  {
    id: "4",
    title: "Development Phase",
    process: ["Frontend Development", "Backend Development", "Integration"],
  },
  {
    id: "5",
    title: "Testing Phase",
    process: ["Quality Assurance", "Cross-Browser Testing", "Device Testing"],
  },
  {
    id: "6",
    title: "Post-Launch Phase",
    process: ["Performance Monitoring", "Maintenance & Support"],
  },
  {
    id: "7",
    title: "Deployment Phase",
    process: ["Launch Preparation", "Launch and Deployment"],
  },
  {
    id: "8",
    title: "Optimization Phase",
    process: ["SEO Optimization", "Conversion Rate Optimization"],
  },
];

export const DevProcessInitialEdges: Edge[] = [
  {
    id: "1-2",
    source: "1",
    sourceHandle: "right",
    target: "2",
    targetHandle: "left",
    type: "customEdge",
    animated: true,
  },
  {
    id: "2-3",
    source: "2",
    sourceHandle: "right",
    target: "3",
    targetHandle: "left",
    type: "customEdge",
    animated: true,
  },
  {
    id: "3-4",
    source: "3",
    sourceHandle: "left",
    target: "4",
    targetHandle: "top",
    type: "customEdge",
    animated: true,
  },
  {
    id: "4-5",
    source: "4",
    sourceHandle: "left",
    target: "5",
    targetHandle: "top",
    type: "customEdge",
    animated: true,
  },
  {
    id: "5-6",
    source: "5",
    sourceHandle: "right",
    target: "6",
    targetHandle: "top",
    type: "customEdge",
    animated: true,
  },
  {
    id: "6-7",
    source: "6",
    sourceHandle: "right",
    target: "7",
    targetHandle: "left",
    type: "customEdge",
    animated: true,
  },
  {
    id: "7-8",
    source: "7",
    sourceHandle: "left",
    target: "8",
    targetHandle: "top",
    type: "customEdge",
    animated: true,
  },
];

export const DevProcessInitialNodes: Node[] = [
  {
    id: "1",
    data: {
      id: "1",
      title: "Discovery Phase",
      process: ["Initial Consultation", "Research and Analysis"],
    },
    position: { x: 0, y: 0 },
    type: "devProcessCard",
  },
  {
    id: "2",
    data: {
      id: "2",
      title: "Planning Phase",
      process: ["Project Scope", "Information Architecture"],
    },
    position: { x: 400, y: 90 },
    type: "devProcessCard",
  },
  {
    id: "3",
    data: {
      id: "3",
      title: "Design Phase",
      process: ["Visual Design", "User Experience (UX) Design"],
    },
    position: { x: 750, y: 220 },
    type: "devProcessCard",
  },
  {
    id: "4",
    data: {
      id: "4",
      title: "Development Phase",
      process: ["Frontend Development", "Backend Development", "Integration"],
    },
    position: { x: 280, y: 450 },
    type: "devProcessCard",
  },
  {
    id: "5",
    data: {
      id: "5",
      title: "Testing Phase",
      process: ["Quality Assurance", "Cross-Browser Testing", "Device Testing"],
    },
    position: { x: -50, y: 620 },
    type: "devProcessCard",
  },
  {
    id: "6",
    data: {
      id: "6",
      title: "Post-Launch Phase",
      process: ["Performance Monitoring", "Maintenance & Support"],
    },
    position: { x: 350, y: 850 },
    type: "devProcessCard",
  },
  {
    id: "7",
    data: {
      id: "7",
      title: "Deployment Phase",
      process: ["Launch Preparation", "Launch and Deployment"],
    },
    position: { x: 720, y: 1100 },
    type: "devProcessCard",
  },
  {
    id: "8",
    data: {
      id: "8",
      title: "Optimization Phase",
      process: ["SEO Optimization", "Conversion Rate Optimization"],
    },
    position: { x: 280, y: 1350 },
    type: "devProcessCard",
  },
  {
    id: "9",
    data: {
      src: "https://codebility-cdn.pages.dev/assets/images/ai-integration/arrow-facing-left.png",
      alt: "Arrow Facing Left Image",
      width: 139,
      height: 112,
    },
    position: { x: 600, y: 0 },
    type: "devProcessImage",
  },
  {
    id: "10",
    data: {
      src: "https://codebility-cdn.pages.dev/assets/images/ai-integration/big-star.png",
      alt: "Big Star Image",
      width: 139,
      height: 143,
    },
    position: { x: -30, y: 400 },
    type: "devProcessImage",
  },
  {
    id: "11",
    data: {
      src: "https://codebility-cdn.pages.dev/assets/images/ai-integration/small-star.png",
      alt: "Small Star Image",
      width: 65,
      height: 62,
    },
    position: { x: 800, y: 460 },
    type: "devProcessImage",
  },
  {
    id: "12",
    data: {
      src: "https://codebility-cdn.pages.dev/assets/images/ai-integration/shield.png",
      alt: "Shield Image",
      width: 133,
      height: 123,
    },
    position: { x: 650, y: 650 },
    type: "devProcessImage",
  },
  {
    id: "13",
    data: {
      src: "https://codebility-cdn.pages.dev/assets/images/ai-integration/arrow-facing-right.png",
      alt: "Arrow Facing Right Image",
      width: 102,
      height: 101,
    },
    position: { x: 150, y: 930 },
    type: "devProcessImage",
  },
  {
    id: "14",
    data: {
      src: "https://codebility-cdn.pages.dev/assets/images/ai-integration/cloud.png",
      alt: "Cloud Image",
      width: 189,
      height: 186,
    },
    position: { x: -50, y: 1200 },
    type: "devProcessImage",
  },
  {
    id: "15",
    data: {
      src: "https://codebility-cdn.pages.dev/assets/images/ai-integration/arrow-facing-top.png",
      alt: "Arrow Facing Top Image",
      width: 117,
      height: 114,
    },
    position: { x: 90, y: 1190 },
    type: "devProcessImage",
  },
];

export const PartnerInitialEdges: Edge[] = [
  {
    id: "1-2",
    source: "1",
    sourceHandle: "right",
    target: "2",
    targetHandle: "bottom",
    type: "customEdge",
  },
  {
    id: "1-3",
    source: "1",
    sourceHandle: "top",
    target: "3",
    targetHandle: "right",
    type: "customEdge",
  },
  {
    id: "1-4",
    source: "1",
    sourceHandle: "bottom",
    target: "4",
    targetHandle: "left",
    type: "customEdge",
  },
  {
    id: "1-5",
    source: "1",
    sourceHandle: "left",
    target: "5",
    targetHandle: "top",
    type: "customEdge",
  },
];

export const PartnerInitialNodes: Node[] = [
  {
    id: "1",
    data: {
      title: "Why Partner with Codebility?",
    },
    position: { x: 350, y: 250 }, // middle
    type: "partnerTitle",
  },
  {
    id: "2",
    data: {
      title: "Custom Solutions",
      description:
        "We provide personalized development services to ensure your project meets your specific business goals.",
    },
    position: { x: 600, y: 50 }, // top right
    type: "partnerCard",
  },
  {
    id: "3",
    data: {
      title: "Expertise in Modern Tech",
      description:
        "We use the latest technologies to build dynamic websites and mobile apps tailored to your needs.",
    },
    position: { x: 0, y: 0 }, // top left
    type: "partnerCard",
  },
  {
    id: "4",
    data: {
      title: "AI Integration",
      description:
        "Enhance your digital products with our advanced AI solutions for better performance and user experience.",
    },
    position: { x: 650, y: 400 }, // bottom right
    type: "partnerCard",
  },
  {
    id: "5",
    data: {
      title: "Comprehensive Service",
      description:
        "From design to maintenance, we handle every aspect of development, making the process seamless for you.",
    },
    position: { x: 50, y: 450 }, // bottom left
    type: "partnerCard",
  },
];

export const unparalleledDigitalSuccessData = [
  {
    id: "1",
    title: "Custom Website Development",
    description:
      "Our developers specialize in creating tailor-made websites that reflect your brand’s unique identity.",
    image: customWebDev,
  },
  {
    id: "2",
    title: "Responsive Design",
    description:
      "Every website we build is fully responsive, ensuring a seamless experience across all devices.",
    image: responsiveDesign,
  },
  {
    id: "3",
    title: "SEO Optimization",
    description:
      "We integrate SEO best practices into every website we build, helping you rank higher in search engine results and attract more organic traffic.",
    image: seo,
  },
];

export const mobileAppServicesData = [
  {
    id: "1",
    title: "Custom App Development",
    description:
      "We create custom mobile apps for your unique needs, whether on iOS, Android, or cross-platform, ensuring your app shines.",
    image: customAppDevelopment,
  },
  {
    id: "2",
    title: "User-Centric Design",
    description:
      "We prioritize user experience to keep your customers engaged and satisfied.",
    image: userCentricDesign,
  },
  {
    id: "3",
    title: "Enterprise Solutions",
    description:
      "We develop apps that enhance productivity, facilitate communication, and support your business processes.",
    image: enterpriseSolution,
  },
];
