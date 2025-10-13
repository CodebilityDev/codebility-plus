import type { Config } from "tailwindcss";

import baseConfig from "@codevs/tailwind-config/web";
import { green } from "@mui/material/colors";
import { custom } from "zod";
import typography from "@tailwindcss/typography";

const svgToDataUri = require("mini-svg-data-uri");
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

// Inline type definitions
type AddVariablesForColorsParams = {
  addBase: (base: Record<string, any>) => void;
  theme: (path: string) => Record<string, string>;
};

type PluginFunctionParams = {
  matchUtilities: (
    utilities: Record<string, (value: string) => Record<string, string>>,
    options: {
      values: Record<string, string>;
      type: string;
    },
  ) => void;
  theme: (path: string) => Record<string, string>;
};

const config: Config = {
  content: [
    ...baseConfig.content,
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./@/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      backgroundImage: {
        login: "url('/assets/images/bg-login.png')",
        "section-wrapper": "url('/assets/images/bg-pattern.png')",
        "code-pattern": "url('/assets/images/bg-pattern-code.png')",
        "latest-tech": "url('/assets/images/ai-integration/black-wave.png')",
        roadmap: "url('/assets/images/roadmap.png')",
      },
      screens: {
        phone: { max: "425px" },
        tablet: { max: "767px" },
        laptop: { max: "1024px" },
        desktop: { max: "1280px" },
        xl3: { min: "1600px" },
        mobile: { min: "300px", max: "639px" },
      },
      boxShadow: {
        stiglitz:
          "rgba(50,50,93,0.25) 0px 6px 12px -2px, rgba(0,0,0,0.3) 0px 3px 7px -3px",
      },
      colors: {
        primary: "#0E0E0E",
        secondary: "#8E8E8E",
        lightgray: "#DBDBDB",
        darkgray: "#2E2E2E",
        customGreen: "#4BCE97",
        customBlue: {
          100: "#6A78F2",
          200: "#404993",
          300: "#3A4285",
          400: "#2B2F5C",
          500: "#583DFF",
          600: "#1F2449",
          700: "#00738B",
          800: "#0C3FDB",
          900: "#0A3B9D",
        },
        customRed: {
          100: "#D45454",
          200: "#A23939",
        },
        customViolet: {
          100: "#9747FF",
          200: "#C108FE",
          300: "#9707DD",
        },
        customTeal: "#02FFE2",
        white: "#F4F4F4",
        black: {
          100: "#181818",
          200: "#444857",
          300: "#5A5F73",
          400: "#030303",
          500: "#0E0E0E",
          600: "#0A0A0A",
          700: "#101010",
          800: "#1D1D1E",
        },
        gray: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#2c303a",
          900: "#2C303A",
        },
        grey: {
          100: "#898989",
        },
        dark: {
          100: "#1e1f26",
          200: "#2c303a",
          300: "#131417",
          400: "#212734",
          500: "#0F1013",
        },
        light: {
          900: "#FFFFFF",
          800: "#F4F6F8",
          850: "#FDFDFD",
          700: "#DCE3F1",
          500: "#7B8EC8",
          400: "#858EAD",
          300: "#FCFCFC",
        },
        codeRed: "#EB5A46",
        codeBlue: "#F2D600",
        codeGreen: "#61BD4F",
        codeYellow: "#D9D9D9",
        codePurple: "#4FBD95",
        codeViolet: "#FFAB4A",

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        figmamuted: {
          DEFAULT: "rgba(var(--muted-figma))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
          client: "rgba(var(--card-clients))",
        },

        status: {
          training: {
            DEFAULT: "#997000", // yellow-800
            text: "#FFFFFF",
          },
          graduated: {
            DEFAULT: "#4BCE97", // green
            text: "#FFFFFF",
          },
          inactive: {
            DEFAULT: "#FEE2E2", // red-200
            text: "#991B1B",
          },
          admin: {
            DEFAULT: "#DCFCE7", // green-200
            text: "#166534",
          },
          deployed: {
            DEFAULT: "#F3E8FF", // purple-200
            text: "#6B21A8",
          },
          mentor: {
            DEFAULT: "#F5F3FF", // violet-200
            text: "#5B21B6",
          },
          availability: {
            online: "#4BCE97", // green
            offline: "#D45454", // red-100
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        orbit: {
          "0%": {
            transform:
              "rotate(0deg) translateY(calc(var(--radius) * 1px)) rotate(0deg)",
          },
          "100%": {
            transform:
              "rotate(360deg) translateY(calc(var(--radius) * 1px)) rotate(-360deg)",
          },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-100% - var(--gap)))" },
        },
        "marquee-vertical": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(calc(-100% - var(--gap)))" },
        },
        floatY: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-15px)" },
        },
        "bell-ring": {
          "0%, 100%": { transform: "rotate(0)" },
          "10%, 30%": { transform: "rotate(-10deg)" },
          "20%, 40%": { transform: "rotate(10deg)" },
          "50%": { transform: "rotate(0)" },
        },
        "slide-down": {
          from: { 
            opacity: "0",
            transform: "translateY(-10px)"
          },
          to: { 
            opacity: "1",
            transform: "translateY(0)"
          },
        },
        ping: {
          "75%, 100%": {
            transform: "scale(2)",
            opacity: "0",
          },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "fade-in-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "pulse-glow": {
          "0%, 100%": {
            boxShadow: "0 0 5px rgba(59, 130, 246, 0.3)",
          },
          "50%": {
            boxShadow: "0 0 20px rgba(59, 130, 246, 0.6)",
          },
        },
        floating: {
          "0%, 100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-5px)",
          },
        },
        "card-3d": {
          "0%": {
            transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)",
          },
          "100%": {
            transform: "perspective(1000px) rotateX(-5deg) rotateY(3deg) translateY(-8px) scale(1.02)",
          },
        },
        "card-glow": {
          "0%": {
            boxShadow: "0 4px 20px rgba(59, 130, 246, 0.1)",
          },
          "100%": {
            boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3), 0 0 0 1px rgba(59, 130, 246, 0.1)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        orbit: "orbit calc(var(--duration)*1s) linear infinite",
        marquee: "marquee var(--duration) linear infinite",
        "marquee-vertical": "marquee-vertical var(--duration) linear infinite",
        floatY: "floatY 6s ease-in-out infinite",
        "bell-ring": "bell-ring 1s ease-in-out",
        "slide-down": "slide-down 0.3s ease-out",
        ping: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
        shimmer: "shimmer 2s infinite",
        "fade-in-up": "fade-in-up 0.6s ease-out",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        floating: "floating 3s ease-in-out infinite",
        "card-3d": "card-3d 0.3s ease-out forwards",
        "card-glow": "card-glow 0.3s ease-out forwards",
      },
      perspective: {
        800: "800px",
        1000: "1000px",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    typography,
    addVariablesForColors,
    function ({ matchUtilities, theme }: PluginFunctionParams) {
      try {
        matchUtilities(
          {
            "bg-grid": (value: string) => ({
              backgroundImage: `url("${svgToDataUri(
                `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`,
              )}")`,
            }),
            "bg-grid-small": (value: string) => ({
              backgroundImage: `url("${svgToDataUri(
                `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="8" height="8" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`,
              )}")`,
            }),
            "bg-dot": (value: string) => ({
              backgroundImage: `url("${svgToDataUri(
                `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="1.6257413380501518"></circle></svg>`,
              )}")`,
            }),
          },
          {
            values: flattenColorPalette(theme("backgroundColor")),
            type: "color",
          },
        );
      } catch (error) {
        console.warn("Failed to register Tailwind utilities:", error);
      }
    },
  ],
  presets: [baseConfig],
};

export default config;

function addVariablesForColors({
  addBase,
  theme,
}: AddVariablesForColorsParams) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val]),
  );

  addBase({
    ":root": newVars,
  });
}
