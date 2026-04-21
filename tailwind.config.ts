import type { Config } from "tailwindcss";

/**
 * AjiraNext Design System — Tailwind v4 Theme Configuration
 *
 * Tailwind v4 primarily uses CSS-based theming via @theme inline in globals.css.
 * This file serves as the typed source of truth and can be imported by tooling.
 */

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./stories/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        card: "var(--card)",
        fg: "var(--fg)",
        "fg-muted": "var(--fg-muted)",
        "fg-inverse": "var(--fg-inverse)",
        primary: "var(--primary)",
        "primary-hover": "var(--primary-hover)",
        "primary-fg": "var(--primary-fg)",
        accent: "var(--accent)",
        border: "var(--border)",
        ring: "var(--ring)",
        success: "hsl(142 70% 55%)",
        warning: "hsl(38 92% 60%)",
        danger: "hsl(0 84% 65%)",
        info: "hsl(217 91% 60%)",
      },
      fontFamily: {
        sans: [
          "'Inter'",
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "sans-serif",
        ],
      },
      fontSize: {
        "2xs": "0.625rem",
      },
      lineHeight: {
        tight: "1.1",
        heading: "1.25",
        base: "1.6",
      },
      letterSpacing: {
        wide: "0.12em",
        wider: "0.14em",
        widest: "0.18em",
      },
      borderRadius: {
        sm: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "24px",
        "4xl": "32px",
      },
      width: {
        sidebar: "260px",
        page: "1280px",
      },
      maxWidth: {
        page: "1280px",
      },
      boxShadow: {
        xs: "0 1px 2px hsl(0 0% 0% / 0.25)",
        sm: "0 2px 8px hsl(0 0% 0% / 0.25)",
        md: "0 8px 24px hsl(0 0% 0% / 0.35)",
        lg: "0 20px 40px hsl(0 0% 0% / 0.45)",
        glow: "0 0 0 1px hsl(155 100% 42% / 0.25), 0 12px 32px hsl(155 100% 42% / 0.15)",
        editorial: "0 12px 40px hsl(0 0% 0% / 0.3)",
        focus: "0 0 0 3px var(--ring-focus)",
        "focus-danger": "0 0 0 3px var(--danger-ring-focus)",
      },
      scale: {
        "97": "0.97",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "pop-in": {
          from: { opacity: "0", transform: "translateY(8px) scale(0.98)" },
          to: { opacity: "1", transform: "none" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
        "pop-in": "pop-in 0.2s ease-out",
        marquee: "marquee 35s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
