export const typography = {
  fontFamily: {
    sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    icon: "'Material Symbols Outlined'",
  },
  fontSize: {
    "2xs": "0.625rem",  // 10px
    xs: "0.75rem",      // 12px
    sm: "0.875rem",     // 14px
    base: "1rem",       // 16px
    lg: "1.125rem",     // 18px
    xl: "1.25rem",      // 20px
    "2xl": "1.5rem",    // 24px
    "3xl": "1.875rem",  // 30px
    "4xl": "2.25rem",   // 36px
    "5xl": "3rem",      // 48px
    "7xl": "4.5rem",    // 72px
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
  lineHeight: {
    tight: 1.1,
    heading: 1.25,
    base: 1.6,
    relaxed: 1.75,
  },
  letterSpacing: {
    tighter: "-0.05em",
    tight: "-0.03em",
    normal: "0em",
    wide: "0.12em",
    wider: "0.14em",
    widest: "0.18em",
  },
} as const;

export type Typography = typeof typography;
