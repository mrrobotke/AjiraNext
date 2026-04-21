"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Heading } from "@/design-system/atoms/Heading";
import { Paragraph } from "@/design-system/atoms/Paragraph";
import { Button } from "@/design-system/atoms/Button";
import { Chip } from "@/design-system/atoms/Chip";
import { Icon } from "@/design-system/atoms/Icon";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface HeroSectionProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "title"
> {
  variant?: "A" | "B" | "C";
  eyebrow?: string;
  title: React.ReactNode;
  subtitle: string;
  ctaPrimary?: { label: string; href?: string };
  ctaSecondary?: { label: string; href?: string };
  searchCells?: { label: string; placeholder: string }[];
  searchChips?: string[];
  stats?: Array<{ value: string; label: string }>;
  topBar?: { left: React.ReactNode; right: React.ReactNode };
  marks?: string[];
  media?: React.ReactNode;
  dark?: boolean;
  matchCard?: {
    role: string;
    detail: string;
    score: number;
  };
  pingCard?: {
    label: string;
    sublabel: string;
  };
  floatCards?: Array<{
    icon: string;
    company: string;
    role: string;
    fit: string;
    pos: string;
    delay: string;
  }>;
  heroImages?: { main: string; secondary: string };
}

/* ------------------------------------------------------------------ */
/*  Shared bits                                                        */
/* ------------------------------------------------------------------ */

const TrustStats: React.FC<{
  stats: Array<{ value: string; label: string }>;
  className?: string;
}> = ({ stats, className }) => (
  <div
    className={cn("flex gap-8 pt-7 border-t border-border max-w-lg", className)}
  >
    {stats.map((stat) => (
      <div key={stat.label}>
        <span className="block text-3xl font-black tracking-tight text-fg leading-none">
          {stat.value}
        </span>
        <span className="block text-2xs font-bold text-fg-muted uppercase tracking-wide mt-1.5">
          {stat.label}
        </span>
      </div>
    ))}
  </div>
);

/* ------------------------------------------------------------------ */
/*  Variant A — Editorial Split                                        */
/* ------------------------------------------------------------------ */

const HeroA: React.FC<Omit<HeroSectionProps, "variant" | "media">> = ({
  eyebrow,
  title,
  subtitle,
  ctaPrimary,
  ctaSecondary,
  searchCells,
  searchChips,
  stats,
  topBar,
  marks,
  matchCard = {
    role: "Senior Product Strategist",
    detail: "Andela · Remote · USD 140k",
    score: 98,
  },
  pingCard = { label: "3 new fits today", sublabel: "Based on your profile" },
  heroImages = {
    main: "/assets/hero_main.jpg",
    secondary: "/assets/hero-woman-laptop.jpg",
  },
}) => {
  return (
    <section className="relative px-8 pt-10 pb-0">
      <div className="max-w-page mx-auto">
        {/* Top bar */}
        {topBar && (
          <div className="flex justify-between items-center gap-4 pb-5.5 border-b border-border text-2xs font-extrabold uppercase tracking-widest text-fg-muted">
            <span>{topBar.left}</span>
            <span>{topBar.right}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-12 py-14 lg:py-14 lg:pb-22 items-center">
          {/* Left column */}
          <div>
            {eyebrow && (
              <span className="inline-flex items-center gap-2.5 text-xs font-extrabold uppercase tracking-widest text-fg-muted">
                <span className="w-8 h-px bg-primary" />
                <span className="text-primary not-italic">01</span>
                {eyebrow}
              </span>
            )}

            <Heading as="h1" size="hero-a" className="mt-7 mb-6">
              {title}
            </Heading>

            <Paragraph size="lg" muted className="mb-8 max-w-lg">
              {subtitle}
            </Paragraph>

            {/* Search form */}
            {searchCells && searchCells.length > 0 && (
              <form
                onSubmit={(e) => e.preventDefault()}
                className="bg-card border border-border rounded-2.5xl p-2.5 grid grid-cols-[1.2fr_1fr_auto] gap-1.5 shadow-md max-w-xl"
              >
                {searchCells.map((cell) => (
                  <div
                    key={cell.label}
                    className="flex flex-col gap-0.5 px-3.5 py-2 rounded-xl hover:bg-surface transition-colors min-w-0"
                  >
                    <label className="text-2xs font-extrabold uppercase tracking-wide text-fg-muted">
                      {cell.label}
                    </label>
                    <input
                      type="text"
                      placeholder={cell.placeholder}
                      className="bg-transparent border-none outline-none text-fg text-sm font-semibold p-0 placeholder:text-fg-muted/60"
                    />
                  </div>
                ))}
                <Button
                  type="submit"
                  size="lg"
                  className="h-full rounded-xl px-5"
                >
                  Search
                  <Icon name="ArrowUpRight" size={16} />
                </Button>
              </form>
            )}

            {/* Chips */}
            {searchChips && searchChips.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-4.5">
                <span className="text-2xs font-extrabold text-fg-muted uppercase tracking-wide mr-1">
                  Popular
                </span>
                {searchChips.map((chip) => (
                  <Chip
                    key={chip}
                    variant="muted"
                    className="cursor-pointer hover:bg-primary hover:text-primary-fg hover:border-primary transition-colors"
                  >
                    {chip}
                  </Chip>
                ))}
              </div>
            )}

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3 mb-6 mt-6">
              {ctaPrimary && <Button size="lg">{ctaPrimary.label}</Button>}
              {ctaSecondary && (
                <Button variant="outline" size="lg">
                  {ctaSecondary.label}
                </Button>
              )}
            </div>

            {/* Stats */}
            {stats && stats.length > 0 && (
              <TrustStats stats={stats} className="mt-10" />
            )}
          </div>

          {/* Right column — image collage */}
          <div className="relative h-[640px] hidden lg:block">
            <div className="absolute top-0 right-0 w-96 aspect-[3/4] rounded-3xl overflow-hidden shadow-lg z-[2]">
              <img
                src={heroImages.main}
                alt="Professional"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 left-0 w-64 aspect-[4/5] rounded-2.5xl overflow-hidden shadow-lg z-[3] border-6 border-bg">
              <img
                src={heroImages.secondary}
                alt="Working"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Floating match card */}
            <div className="absolute top-5.5 -left-2 z-[4] bg-card border border-border rounded-2xl shadow-lg p-4 w-[240px]">
              <div className="flex justify-between items-center mb-2">
                <b className="text-2xs font-extrabold text-fg-muted uppercase tracking-wide">
                  Match Score
                </b>
                <span className="text-2xl font-black text-primary leading-none tracking-tight">
                  {matchCard.score}
                </span>
              </div>
              <div className="text-sm font-extrabold text-fg mb-0.5">
                {matchCard.role}
              </div>
              <div className="text-xs text-fg-muted">{matchCard.detail}</div>
              <div className="h-1.5 bg-surface rounded-full overflow-hidden mt-2.5">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${matchCard.score}%` }}
                />
              </div>
            </div>

            {/* Floating ping card */}
            <div className="absolute bottom-22 -right-6 z-[4] bg-card border border-border rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <div className="text-xs">
                <b className="text-fg text-xs block">{pingCard.label}</b>
                <span className="text-fg-muted text-2xs">
                  {pingCard.sublabel}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Marks / press mentions */}
        {marks && marks.length > 0 && (
          <div className="flex items-center gap-5.5 justify-center py-6 pt-6 pb-7 border-t border-border text-2xs font-extrabold uppercase tracking-widest text-fg-muted flex-wrap">
            <span className="opacity-70">As seen in</span>
            {marks.map((mark, i) => (
              <React.Fragment key={mark}>
                <b className="text-fg">{mark}</b>
                {i < marks.length - 1 && <span>·</span>}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/*  Variant B — Dark Editorial                                         */
/* ------------------------------------------------------------------ */

const HeroB: React.FC<Omit<HeroSectionProps, "variant" | "media">> = ({
  eyebrow,
  title,
  subtitle,
  ctaPrimary,
  ctaSecondary,
  stats,
  heroImages = {
    main: "/assets/hero-woman-laptop.jpg",
    secondary: "/assets/hero-woman-laptop.jpg",
  },
}) => {
  return (
    <section className="px-8 py-8">
      <div className="max-w-8xl mx-auto bg-bg text-fg rounded-5xl px-8 py-14 lg:px-18 lg:py-16 relative overflow-hidden min-h-[620px]">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
          {/* Left column */}
          <div>
            {eyebrow && (
              <span className="inline-flex items-center gap-2.5 text-2xs font-extrabold uppercase tracking-widest text-fg-muted px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {eyebrow}
              </span>
            )}

            <Heading as="h1" size="hero-b" className="mt-6 mb-6">
              {title}
            </Heading>

            <Paragraph size="lg" muted className="mb-8 max-w-lg">
              {subtitle}
            </Paragraph>

            <div className="flex gap-3">
              {ctaPrimary && (
                <a
                  href={ctaPrimary.href || "#"}
                  className="inline-flex items-center gap-2 bg-primary text-bg px-7 py-4 rounded-full font-extrabold text-sm hover:brightness-110 transition-all"
                >
                  {ctaPrimary.label}
                  <Icon name="ArrowUpRight" size={14} />
                </a>
              )}
              {ctaSecondary && (
                <a
                  href={ctaSecondary.href || "#"}
                  className="inline-flex items-center gap-2 bg-white/[0.08] text-fg px-7 py-4 rounded-full font-bold text-sm border border-white/[0.15] hover:bg-white/[0.12] transition-all"
                >
                  {ctaSecondary.label}
                </a>
              )}
            </div>
          </div>

          {/* Right column — image */}
          <div className="relative rounded-3xl overflow-hidden aspect-[4/5] hidden lg:block">
            <span className="absolute top-5 left-5 bg-bg/75 backdrop-blur-md text-fg px-3.5 py-2 rounded-full text-2xs font-extrabold uppercase tracking-wide border border-white/15 z-10">
              ● Live matches
            </span>
            <img
              src={heroImages.main}
              alt="Professional"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Stats row */}
        {stats && stats.length > 0 && (
          <div className="mt-14 pt-8 border-t border-white/10 grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label}>
                <b className="text-5xl font-black tracking-tight text-primary leading-none block">
                  {stat.value}
                </b>
                <span className="text-2xs font-extrabold uppercase tracking-widest text-fg/50 mt-2 block">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/*  Variant C — Lottie Motion                                          */
/* ------------------------------------------------------------------ */

const HeroC: React.FC<Omit<HeroSectionProps, "variant" | "media">> = ({
  eyebrow,
  title,
  subtitle,
  ctaPrimary,
  ctaSecondary,
  stats,
  floatCards = [
    {
      icon: "◎",
      company: "Paystack",
      role: "PM",
      fit: "98%",
      pos: "top-10 left-0",
      delay: "0s",
    },
    {
      icon: "◈",
      company: "Andela",
      role: "Staff Eng",
      fit: "94%",
      pos: "top-36 right-[-10px]",
      delay: "-2s",
    },
    {
      icon: "✦",
      company: "Safaricom",
      role: "Director",
      fit: "91%",
      pos: "bottom-28 -left-5",
      delay: "-4s",
    },
    {
      icon: "▲",
      company: "Flutterwave",
      role: "VP",
      fit: "88%",
      pos: "bottom-8 right-10",
      delay: "-3s",
    },
  ],
}) => {
  return (
    <section
      className="relative px-8 py-12 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 800px 500px at 80% 20%, color-mix(in oklab, var(--primary) 8%, transparent), transparent 60%), var(--bg)",
      }}
    >
      <div className="max-w-8xl mx-auto grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center min-h-[640px] relative">
        {/* Left column */}
        <div>
          {eyebrow && (
            <span className="inline-flex items-center gap-3 text-2xs font-extrabold uppercase tracking-widest text-fg-muted bg-card border border-border px-4 py-2 rounded-full shadow-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-ring-pulse" />
              {eyebrow}
            </span>
          )}

          <Heading as="h1" size="hero-c" className="mt-6 mb-5">
            {title}
          </Heading>

          <Paragraph size="lg" muted className="mb-8 max-w-xl">
            {subtitle}
          </Paragraph>

          <div className="flex gap-3 items-center flex-wrap">
            {ctaPrimary && (
              <a
                href={ctaPrimary.href || "#"}
                className="inline-flex items-center gap-2.5 bg-fg text-bg px-7 py-4 rounded-full font-extrabold text-sm hover:opacity-90 transition-opacity"
              >
                <span className="w-2 h-2 rounded-full bg-primary" />
                {ctaPrimary.label}
                <Icon name="ArrowUpRight" size={16} />
              </a>
            )}
            {ctaSecondary && (
              <a
                href={ctaSecondary.href || "#"}
                className="inline-flex items-center gap-2 bg-card text-fg px-6 py-4 rounded-full font-bold text-sm border-[1.5px] border-border hover:border-primary hover:bg-surface transition-all"
              >
                {ctaSecondary.label}
              </a>
            )}
          </div>

          {stats && stats.length > 0 && (
            <div className="mt-9 pt-7 border-t border-border flex gap-10 max-w-xl">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <b className="text-3xl font-black tracking-tight leading-none text-fg block">
                    {stat.value}
                  </b>
                  <span className="text-2xs font-bold uppercase tracking-wide text-fg-muted mt-1.5 block">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column — stage */}
        <div className="relative h-[600px] hidden lg:flex items-center justify-center">
          {/* Orbit rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="absolute w-[420px] h-[420px] rounded-full border border-dashed border-border animate-spin-slow"
              aria-hidden
            />
            <div
              className="absolute w-[560px] h-[560px] rounded-full border border-dashed border-border animate-spin-slower opacity-50"
              aria-hidden
            />
          </div>

          {/* Center lottie placeholder */}
          <div className="relative w-80 h-80 rounded-full bg-card border border-border shadow-lg flex items-center justify-center z-[2]">
            <div className="w-64 h-64 rounded-full bg-surface/50 border border-border flex items-center justify-center">
              <Icon
                name="Orbit"
                size={80}
                className="text-primary/40 animate-spin-slow"
              />
            </div>
          </div>

          {/* Floating cards */}
          {floatCards.map((card) => (
            <div
              key={card.company}
              className={cn(
                "absolute bg-card border border-border rounded-xl shadow-lg px-4 py-3.5 flex gap-3 items-center z-[3] animate-float-y",
                card.pos,
              )}
              style={{ animationDelay: card.delay }}
            >
              <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center text-base text-primary flex-shrink-0">
                {card.icon}
              </div>
              <div>
                <b className="text-xs font-extrabold text-fg block">
                  {card.company} · {card.role}
                </b>
                <span className="text-2xs text-fg-muted">{card.fit} fit</span>
              </div>
            </div>
          ))}

          {/* Chip strip */}
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-fg text-bg px-5.5 py-3 rounded-full flex gap-4 items-center shadow-lg text-xs font-bold z-[5]">
            <span className="text-primary font-black">✓</span>
            <span>Scanning 62 vetted roles</span>
            <span className="w-1 h-1 rounded-full bg-white/25" />
            <span>Live neural match</span>
            <span className="w-1 h-1 rounded-full bg-white/25" />
            <span>Updated 2s ago</span>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/*  Public component                                                   */
/* ------------------------------------------------------------------ */

export const HeroSection: React.FC<HeroSectionProps> = ({
  variant = "A",
  className,
  ...rest
}) => {
  if (variant === "B") {
    return <HeroB className={className} {...rest} />;
  }
  if (variant === "C") {
    return <HeroC className={className} {...rest} />;
  }
  return <HeroA className={className} {...rest} />;
};

HeroSection.displayName = "HeroSection";
