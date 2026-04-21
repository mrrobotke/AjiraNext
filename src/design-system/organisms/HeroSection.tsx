import React from "react";
import { cn } from "@/lib/utils";
import { Heading } from "@/design-system/atoms/Heading";
import { Paragraph } from "@/design-system/atoms/Paragraph";
import { Button } from "@/design-system/atoms/Button";
import { Eyebrow } from "@/design-system/atoms/Eyebrow";
import { SearchBar } from "@/design-system/molecules/SearchBar";
import { Chip } from "@/design-system/atoms/Chip";

export interface HeroSectionProps
  extends React.HTMLAttributes<HTMLDivElement> {
  eyebrow?: string;
  title: string;
  subtitle: string;
  ctaPrimary?: { label: string; href?: string };
  ctaSecondary?: { label: string; href?: string };
  searchPlaceholder?: string;
  searchChips?: string[];
  stats?: Array<{ value: string; label: string }>;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  eyebrow,
  title,
  subtitle,
  ctaPrimary,
  ctaSecondary,
  searchPlaceholder,
  searchChips,
  stats,
  className,
  ...rest
}) => {
  return (
    <section
      className={cn("relative px-8 pt-10 pb-20", className)}
      {...rest}
    >
      <div className="max-w-page mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            {eyebrow && (
              <Eyebrow asChip className="mb-6">
                {eyebrow}
              </Eyebrow>
            )}
            <Heading
              as="h1"
              size="7xl"
              weight="bold"
              className="mb-6"
            >
              {title}
            </Heading>
            <Paragraph size="lg" muted className="mb-8 max-w-lg">
              {subtitle}
            </Paragraph>
            <div className="flex flex-wrap gap-3 mb-6">
              {ctaPrimary && <Button>{ctaPrimary.label}</Button>}
              {ctaSecondary && (
                <Button variant="outline">{ctaSecondary.label}</Button>
              )}
            </div>
            {searchPlaceholder && (
              <SearchBar
                placeholder={searchPlaceholder}
                className="max-w-xl mb-4"
              />
            )}
            {searchChips && searchChips.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-2xs font-extrabold text-fg-muted uppercase tracking-wider mr-1">
                  Popular
                </span>
                {searchChips.map((chip) => (
                  <Chip key={chip} variant="muted" className="cursor-pointer hover:bg-primary hover:text-primary-fg hover:border-primary transition-colors">
                    {chip}
                  </Chip>
                ))}
              </div>
            )}
            {stats && stats.length > 0 && (
              <div className="flex gap-8 mt-10 pt-7 border-t border-border max-w-lg">
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
            )}
          </div>
          <div className="relative h-[40rem] hidden lg:block">
            <div className="absolute top-0 right-0 w-96 aspect-[3/4] rounded-4xl overflow-hidden shadow-lg z-[2]">
              <img
                src="/assets/hero_main.jpg"
                alt="Professional"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 left-0 w-64 aspect-[4/5] rounded-2xl overflow-hidden shadow-lg z-[3] border-[6px] border-bg">
              <img
                src="/assets/hero-woman-laptop.jpg"
                alt="Working"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

HeroSection.displayName = "HeroSection";
