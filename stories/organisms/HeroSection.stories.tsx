import type { Meta, StoryObj } from "@storybook/react";
import { HeroSection } from "@/design-system/organisms/HeroSection";

const meta: Meta<typeof HeroSection> = {
  title: "Organisms/HeroSection",
  component: HeroSection,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof HeroSection>;

/* ------------------------------------------------------------------ */
/*  Variant A — Editorial Split                                       */
/* ------------------------------------------------------------------ */

export const VariantA: Story = {
  args: {
    variant: "A",
    eyebrow: "Precision career platform",
    title: (
      <>
        Your next <em className="italic font-normal text-primary font-serif tracking-tight">chapter</em>,
        <br />
        <span className="relative inline-block">
          engineered
          <span className="absolute left-0 right-0 bottom-[6px] h-2.5 bg-primary/18 -z-10 rounded" />
        </span>{" "}
        for Africa&apos;s top 1%.
      </>
    ),
    subtitle:
      "Neural matching against vetted roles at Paystack, Safaricom, Andela, Flutterwave, and 36+ regional leaders. Skip the noise — land work that changes trajectories.",
    topBar: {
      left: (
        <>
          <span className="text-primary not-italic mr-1.5">◉</span>Live · 62 vetted roles this week
        </>
      ),
      right: "Est. 2024 · Nairobi · Lagos · Cape Town · Accra · Remote",
    },
    searchCells: [
      { label: "Role or keyword", placeholder: "Senior Product Manager" },
      { label: "Location", placeholder: "Nairobi, Kenya" },
    ],
    searchChips: ["Product", "Engineering", "Design", "Data", "Marketing"],
    stats: [
      { value: "50k+", label: "Senior leaders" },
      { value: "62+", label: "Live vetted roles" },
      { value: "98%", label: "Match accuracy" },
    ],
    marks: ["TechCabal", "BusinessDaily", "Rest of World", "Quartz Africa", "Semafor"],
  },
};

export const VariantALight: Story = {
  ...VariantA,
  globals: { theme: "light" },
  name: "Variant A (Light)",
};

/* ------------------------------------------------------------------ */
/*  Variant B — Dark Editorial                                        */
/* ------------------------------------------------------------------ */

export const VariantB: Story = {
  args: {
    variant: "B",
    eyebrow: "Precision · Africa · 2026",
    title: (
      <>
        Careers, <em className="italic font-normal text-[#00d67d] font-serif tracking-tight">engineered.</em>
      </>
    ),
    subtitle:
      "Neural matching against vetted roles at Paystack, Andela, Safaricom, Flutterwave, and 36+ other leaders. Skip the noise.",
    ctaPrimary: { label: "Browse 62+ roles", href: "#" },
    ctaSecondary: { label: "See pricing", href: "#" },
    stats: [
      { value: "98%", label: "Match accuracy" },
      { value: "3×", label: "Faster interviews" },
      { value: "45%", label: "Salary uplift" },
      { value: "62+", label: "Open roles" },
    ],
  },
};

export const VariantBLight: Story = {
  ...VariantB,
  globals: { theme: "light" },
  name: "Variant B (Light)",
};

/* ------------------------------------------------------------------ */
/*  Variant C — Lottie Motion                                         */
/* ------------------------------------------------------------------ */

export const VariantC: Story = {
  args: {
    variant: "C",
    eyebrow: "Neural career engine · Live",
    title: (
      <>
        Careers, <em className="italic font-normal text-primary font-serif tracking-tight">in motion</em>.
        <br />
        <span className="bg-gradient-to-r from-fg via-fg to-primary bg-clip-text text-transparent bg-[length:200%_100%] animate-stroke-slide">
          Engineered.
        </span>
      </>
    ),
    subtitle:
      "Watch your next role find you. Our neural matching engine scores 62+ vetted roles against your profile in real time, surfacing only the ones that move the needle.",
    ctaPrimary: { label: "Start matching", href: "#" },
    ctaSecondary: { label: "See the tools", href: "#" },
    stats: [
      { value: "98%", label: "Match accuracy" },
      { value: "12k+", label: "Placements" },
      { value: "3×", label: "Faster hires" },
    ],
  },
  parameters: {
    globals: { theme: "dark" },
  },
};

export const VariantCLight: Story = {
  ...VariantC,
  globals: { theme: "light" },
  name: "Variant C (Light)",
};
