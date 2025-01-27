import type { Config } from "tailwindcss";
import { AddVariablesForColorsParams, PluginFunctionParams } from "@/types";

import baseConfig from "@codevs/tailwind-config/web";

const svgToDataUri = require("mini-svg-data-uri");

const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");
const config: Config = {
  // We need to append the path to the UI package to the content array so that
  // those classes are included correctly.
  content: [
    ...baseConfig.content,
    "./pages/**/*.{ts,tsx}",
    "./Components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./@/**/*.{ts,tsx}",
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
        // => @media (min-width: 640px) { ... }

        laptop: { max: "1024px" },
        // => @media (min-width: 1024px) { ... }

        desktop: { max: "1280px" },
        // => @media (min-width: 1280px) { ... }
      },
      boxShadow: {
        stiglitz:
          "rgba(50,50,93,0.25) 0px 6px 12px -2px, rgba(0,0,0,0.3) 0px 3px 7px -3px",
      },
      colors: {
        primary: "#0E0E0E",
        secondary: "#8E8E8E",
        gray: "#8E8E8E",
        lightgray: "#DBDBDB",
        darkgray: "#2E2E2E",
        green: "#4BCE97",
        blue: {
          100: "#6A78F2",
          200: "#404993",
          300: "#3A4285",
          500: "#583DFF",
          600: "#1F2449",
          700: "#00738B",
          800: "#0C3FDB"
        },
        red: {
          100: "#D45454",
          200: "#A23939",
        },
        violet: {
          100: "#9747FF",
          200: "#C108FE",
          300: "#9707DD",
        },
        teal: "#02FFE2",
        white: "#F4F4F4",
        black: {
          100: "#181818",
          200: "#444857", // hollow button
          300: "#5A5F73", // hollow button hover
          400: "#030303",
          500: "#0E0E0E",
          600: "#0A0A0A",
          700: "#101010",
          800: "#1D1D1E",
        },
        grey: {
          100: "#898989",
        },
        dark: {
          100: "#1e1f26", // Navbar fill color / login box fill color
          200: "#2c303a", // Box fill color , input fill color
          300: "#131417", // login bg color
          400: "#212734",
          500: "#0F1013", // login seamless bg color
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
        codeRed: "#EB5A46", // status-busy
        codeBlue: "#F2D600", // status-vacation
        codeGreen: "#61BD4F", // status-available
        codeYellow: "#D9D9D9", // status-training
        codePurple: "#4FBD95", // status-client-ready
        codeViolet: "#FFAB4A", // status-deployed

        "dark-100": "#1e1f26",
        "dark-200": "#2c303a",
        "dark-300": "#131417",
        "dark-400": "#212734",
        "dark-500": "#14161a",
        "light-500": "#7B8EC8",
        "light-700": "#DCE3F1",
        "light-800": "#F4F6F8",
        "light-850": "#FDFDFD",
        "light-900": "#FFFFFF",

        primaryColor: "#D9D9D9",
        secondaryColor: "#8E8E8E",
        backgroundColor: "#030303",

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // primary: {
        //   DEFAULT: "rgba(var(--primary))",
        //   foreground: "hsl(var(--primary-foreground))",
        // },
        // secondary: {
        //   DEFAULT: "hsl(var(--secondary))",
        //   foreground: "hsl(var(--secondary-foreground))",
        // },
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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      // boxShadow: {
      //   "light-100":
      //     "0px 12px 20px 0px rgba(184, 184, 184, 0.03), 0px 6px 12px 0px rgba(184, 184, 184, 0.02), 0px 2px 4px 0px rgba(184, 184, 184, 0.03)",
      //   "light-200": "10px 10px 20px 0px rgba(218, 213, 213, 0.10)",
      //   "light-300": "-10px 10px 20px 0px rgba(218, 213, 213, 0.10)",
      //   "dark-100": "0px 2px 10px 0px rgba(46, 52, 56, 0.10)",
      //   "dark-200": "2px 0px 20px 0px rgba(39, 36, 36, 0.04)",
      // },
      // screens: {
      //   xs: "420px",
      // },
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        orbit: "orbit calc(var(--duration)*1s) linear infinite",
        marquee: "marquee var(--duration) linear infinite",
        "marquee-vertical": "marquee-vertical var(--duration) linear infinite",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    addVariablesForColors,
    function ({ matchUtilities, theme }: PluginFunctionParams) {
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
    },
  ],
  presets: [baseConfig],
};
export default config;

export function addVariablesForColors({
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
