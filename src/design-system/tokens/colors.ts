export const colors = {
  /* Brand primitives — dark theme */
  navy: {
    900: "hsl(216 60% 10%)",
    800: "hsl(216 55% 12%)",
    750: "hsl(216 55% 13%)",
    700: "hsl(216 55% 14%)",
    600: "hsl(216 50% 17%)",
    500: "hsl(216 40% 25%)",
  },
  slate: {
    400: "hsl(215 20% 65%)",
    50: "hsl(210 40% 98%)",
  },
  white: "hsl(0 0% 100%)",

  /* Primary green */
  green: {
    500: "hsl(155 100% 42%)",
    400: "hsl(155 100% 50%)",
    600: "hsl(155 100% 33%)",
  },

  /* Orange accent */
  orange: {
    500: "hsl(32 95% 60%)",
    600: "hsl(25 95% 53%)",
  },

  /* Semantic status */
  success: "hsl(142 70% 55%)",
  warning: "hsl(38 92% 60%)",
  danger: "hsl(0 84% 65%)",

  /* Light theme primitives */
  paper: {
    DEFAULT: "hsl(40 33% 97%)",
    alt: "hsl(40 25% 93%)",
    card: "hsl(0 0% 100%)",
  },
  ink: {
    900: "hsl(216 60% 10%)",
    600: "hsl(216 20% 30%)",
    400: "hsl(216 12% 48%)",
  },
  rule: "hsl(37 20% 85%)",

  /* Semantic tokens — dark default */
  dark: {
    bg: "hsl(216 60% 10%)",
    surface: "hsl(216 55% 13%)",
    card: "hsl(216 55% 14%)",
    fg: "hsl(210 40% 98%)",
    "fg-muted": "hsl(215 20% 65%)",
    "fg-inverse": "hsl(216 60% 10%)",
    primary: "hsl(155 100% 42%)",
    "primary-hover": "hsl(155 100% 50%)",
    "primary-fg": "hsl(216 60% 10%)",
    accent: "hsl(32 95% 60%)",
    border: "hsl(217 25% 30%)",
    ring: "hsl(155 100% 42%)",
  },

  /* Semantic tokens — light */
  light: {
    bg: "hsl(40 33% 97%)",
    surface: "hsl(40 25% 93%)",
    card: "hsl(0 0% 100%)",
    fg: "hsl(216 60% 10%)",
    "fg-muted": "hsl(216 12% 48%)",
    "fg-inverse": "hsl(0 0% 100%)",
    primary: "hsl(155 100% 33%)",
    "primary-hover": "hsl(155 100% 42%)",
    "primary-fg": "hsl(0 0% 100%)",
    accent: "hsl(25 95% 53%)",
    border: "hsl(37 20% 85%)",
    ring: "hsl(155 100% 33%)",
  },
} as const;

export type Colors = typeof colors;
