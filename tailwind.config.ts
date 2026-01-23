import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "320px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          hover: "hsl(var(--primary-hover))",
          light: "hsl(var(--primary-light))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
          light: "hsl(var(--destructive-light))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
          light: "hsl(var(--success-light))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
          light: "hsl(var(--warning-light))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
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
        },
      },
      borderRadius: {
        xs: "4px",
        sm: "6px",
        md: "8px",
        lg: "12px",
        full: "999px",
      },
      fontSize: {
        "page-title": ["36px", { lineHeight: "1.25", fontWeight: "700" }],
        "section-header": ["24px", { lineHeight: "1.25", fontWeight: "600" }],
        "card-title": ["20px", { lineHeight: "1.25", fontWeight: "600" }],
        "large-body": ["16px", { lineHeight: "1.5", fontWeight: "400" }],
        body: ["14px", { lineHeight: "1.5", fontWeight: "400" }],
        "small-text": ["12px", { lineHeight: "1.5", fontWeight: "400" }],
        "tiny-label": ["11px", { lineHeight: "1.25", fontWeight: "600" }],
        "28px": ["28px", { lineHeight: "1.25", fontWeight: "700" }],
      },
      height: {
        "120": "120px",
      },
      textColor: {
        heading: "var(--text-heading)",
        body: "var(--text-body)",
        muted: "var(--text-muted)",
      },
      lineHeight: {
        tight: "1.25",
        normal: "1.5",
        relaxed: "1.75",
      },
      spacing: {
        "0.5": "4px",
        "2": "8px",
        "3": "12px",
        "4": "16px",
        "6": "24px",
        "8": "32px",
        "12": "48px",
        sidebar: "256px",
        "sidebar-collapsed": "72px",
        header: "64px",
      },
      margin: {
        sidebar: "256px",
        "sidebar-collapsed": "72px",
      },
      boxShadow: {
        "elevation-1": "0 1px 2px rgba(0,0,0,0.05)",
        "elevation-2": "0 1px 3px rgba(0,0,0,0.1)",
        "elevation-3": "0 4px 6px rgba(0,0,0,0.1)",
        "elevation-4": "0 10px 15px rgba(0,0,0,0.1)",
        "elevation-5": "0 20px 25px rgba(0,0,0,0.15)",
      },
      transitionDuration: {
        200: "200ms",
        300: "300ms",
        150: "150ms",
      },
      transitionTimingFunction: {
        "cubic-ease": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      keyframes: {
        "slide-in": {
          "0%": { transform: "translateX(400px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
      },
      animation: {
        "slide-in": "slide-in 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
