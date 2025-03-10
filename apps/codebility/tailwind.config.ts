import type { Config } from "tailwindcss";

import baseConfig from "@codevs/tailwind-config/web";

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
        laptop: { max: "1024px" },
        desktop: { max: "1280px" },
        xl3: { min: "1600px" },
        mobile:{ min: "300px", max: "639px" },
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
          800: "#0C3FDB",
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
          200: "#444857",
          300: "#5A5F73",
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
          busy: {
            DEFAULT: "#FEE2E2", // red-200
            text: "#991B1B",
          },
          failed: {
            DEFAULT: "#FEE2E2", // red-200
            text: "#991B1B",
          },
          available: {
            DEFAULT: "#DCFCE7", // green-200
            text: "#166534",
          },
          deployed: {
            DEFAULT: "#F3E8FF", // purple-200
            text: "#6B21A8",
          },
          vacation: {
            DEFAULT: "#DBEAFE", // blue-200
            text: "#1E40AF",
          },
          clientready: {
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
