import React from "react";
import { cn } from "@/lib/utils";
import { Logo } from "@/design-system/atoms/Logo";
import { NavItem } from "@/design-system/molecules/NavItem";
import { Button } from "@/design-system/atoms/Button";
import { IconButton } from "@/design-system/atoms/IconButton";
import { MarketPill } from "@/design-system/molecules/MarketPill";
import { DropdownMenu } from "@/design-system/molecules/DropdownMenu";

export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  activeLink?: string;
  onThemeToggle?: () => void;
  theme?: "light" | "dark";
  user?: { email?: string } | null;
  dashboardHref?: string | null;
}

const links = [
  { label: "Home", href: "/" },
  { label: "Jobs", href: "/jobs" },
  { label: "Employers", href: "/for-employers" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Help", href: "/help" },
];

export const Header: React.FC<HeaderProps> = ({
  activeLink,
  onThemeToggle,
  theme = "dark",
  user,
  dashboardHref,
  className,
  ...rest
}) => {
  return (
    <nav
      className={cn(
        "sticky top-0 z-30 py-5 px-8",
        "bg-gradient-to-b from-bg to-transparent",
        className,
      )}
      {...rest}
    >
      <div
        className={cn(
          "max-w-page mx-auto flex items-center gap-4",
          "bg-card border border-border rounded-full",
          "px-6 py-2.5 shadow-sm",
        )}
      >
        <Logo />
        <div className="flex-1 flex justify-center gap-0.5">
          {links.map((link) => (
            <NavItem
              key={link.label}
              href={link.href}
              active={activeLink === link.label}
            >
              {link.label}
            </NavItem>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <MarketPill flag="🇰🇪" currency="KES" />
          {onThemeToggle && (
            <IconButton
              icon={theme === "light" ? "Moon" : "Sun"}
              size="sm"
              onClick={onThemeToggle}
              aria-label="Toggle theme"
            />
          )}
          {user ? (
            <Button asChild size="sm" variant="secondary">
              <a href={dashboardHref ?? "/seeker"}>Dashboard</a>
            </Button>
          ) : (
            <>
              <a href="/auth?mode=signin">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </a>
              <DropdownMenu
                trigger={<Button size="sm">Get Started ▾</Button>}
                items={[
                  {
                    icon: "User",
                    label: "Sign up as Job Seeker",
                    description: "Find your next role",
                    href: "/auth?mode=signup&as=seeker",
                  },
                  {
                    icon: "Briefcase",
                    label: "Sign up as Employer",
                    description: "Post jobs & source talent",
                    href: "/auth?mode=signup&as=employer",
                  },
                  { separator: true },
                  {
                    icon: "LayoutDashboard",
                    label: "Enter Seeker Dashboard",
                    description: "Demo mode",
                    href: "/seeker",
                  },
                  {
                    icon: "LayoutDashboard",
                    label: "Enter Employer Dashboard",
                    description: "Demo mode",
                    href: "/employer",
                  },
                ]}
              />
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

Header.displayName = "Header";
