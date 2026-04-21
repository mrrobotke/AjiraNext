export const shadows = {
  xs: "0 1px 2px hsl(0 0% 0% / 0.25)",
  sm: "0 2px 8px hsl(0 0% 0% / 0.25)",
  md: "0 8px 24px hsl(0 0% 0% / 0.35)",
  lg: "0 20px 40px hsl(0 0% 0% / 0.45)",
  glow: "0 0 0 1px hsl(155 100% 42% / 0.25), 0 12px 32px hsl(155 100% 42% / 0.15)",
  editorial: "0 12px 40px hsl(0 0% 0% / 0.3)",
  /* Light theme variants */
  "light-xs": "0 1px 2px hsl(216 60% 10% / 0.06)",
  "light-sm": "0 2px 8px hsl(216 60% 10% / 0.06)",
  "light-md": "0 10px 28px hsl(216 60% 10% / 0.08)",
  "light-lg": "0 24px 48px hsl(216 60% 10% / 0.12)",
  "light-editorial": "0 18px 56px hsl(216 60% 10% / 0.14)",
} as const;

export type Shadows = typeof shadows;
