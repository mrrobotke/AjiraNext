export const radii = {
  none: "0px",
  sm: "6px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  "2xl": "24px",
  "4xl": "32px",
  full: "9999px",
} as const;

export type Radii = typeof radii;
