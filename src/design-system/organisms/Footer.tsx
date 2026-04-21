import React from "react";
import { cn } from "@/lib/utils";
import { Logo } from "@/design-system/atoms/Logo";
import { Paragraph } from "@/design-system/atoms/Paragraph";
import { Link } from "@/design-system/atoms/Link";
import { IconButton } from "@/design-system/atoms/IconButton";

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {}

const columns = [
  {
    title: "For Seekers",
    links: [
      { label: "Browse Jobs", href: "/jobs" },
      { label: "Resume Tools", href: "/seeker?tab=resume" },
      { label: "Career Paths", href: "/seeker?tab=paths" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "For Employers",
    links: [
      { label: "Post a Job", href: "/for-employers" },
      { label: "Plans", href: "/pricing" },
      { label: "Employer Login", href: "/employer" },
      { label: "Contact Sales", href: "/contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
      { label: "Help", href: "/help" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/legal#privacy" },
      { label: "Terms", href: "/legal#terms" },
      { label: "Cookies", href: "/legal#cookies" },
      { label: "Data Protection", href: "/legal#data" },
    ],
  },
];

const socials = [
  { icon: "Globe" as const, label: "Website" },
  { icon: "Mail" as const, label: "Email" },
  { icon: "MessageCircle" as const, label: "Chat" },
  { icon: "Share2" as const, label: "Share" },
];

export const Footer: React.FC<FooterProps> = ({ className, ...rest }) => {
  return (
    <footer
      className={cn(
        "bg-bg border-t border-border py-14 px-8",
        className
      )}
      {...rest}
    >
      <div className="max-w-page mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8 mb-10">
          <div className="md:col-span-2">
            <Logo />
            <Paragraph size="sm" className="mt-3 max-w-xs">
              The elite career platform for high-impact professionals across
              Africa.
            </Paragraph>
            <div className="flex gap-2 mt-3.5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  title={s.label}
                  className="w-8 h-8 rounded-full bg-surface border border-border inline-flex items-center justify-center text-fg-muted hover:text-primary transition-colors"
                >
                  <IconButton
                    icon={s.icon}
                    size="sm"
                    variant="ghost"
                    className="w-8 h-8"
                    aria-label={s.label}
                  />
                </a>
              ))}
            </div>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-2xs font-extrabold uppercase tracking-wider text-fg mb-3.5">
                {col.title}
              </h4>
              {col.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  muted
                  className="block text-sm mb-2"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row justify-between pt-6 border-t border-border text-xs text-fg-muted gap-2">
          <span>© 2026 Ajira Next · Made in Nairobi</span>
          <span>Kenya · Nigeria · South Africa · Ghana · Rwanda</span>
        </div>
      </div>
    </footer>
  );
};

Footer.displayName = "Footer";
