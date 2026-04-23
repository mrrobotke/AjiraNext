"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Logo } from "@/design-system/atoms/Logo";
import { IconButton } from "@/design-system/atoms/IconButton";
import { Button } from "@/design-system/atoms/Button";

export interface MobileMarketingHeaderProps extends React.HTMLAttributes<HTMLElement> {
  onMenuToggle?: () => void;
  menuOpen?: boolean;
  user?: { email?: string } | null;
  dashboardHref?: string | null;
}

export const MobileMarketingHeader: React.FC<MobileMarketingHeaderProps> = ({
  onMenuToggle,
  menuOpen = false,
  user,
  dashboardHref,
  className,
  ...rest
}) => {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 px-4 py-3",
        "bg-gradient-to-b from-bg to-transparent",
        className,
      )}
      {...rest}
    >
      <div
        className={cn(
          "flex items-center justify-between",
          "bg-card border border-border rounded-full",
          "px-4 py-2 shadow-sm",
        )}
      >
        <IconButton
          icon={menuOpen ? "X" : "Menu"}
          size="sm"
          variant="ghost"
          onClick={onMenuToggle}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-drawer"
        />
        <Logo />
        {user ? (
          <Button asChild size="sm">
            <a href={dashboardHref ?? "/seeker"}>Dashboard</a>
          </Button>
        ) : (
          <Button asChild size="sm" variant="ghost">
            <a href="/auth?mode=signin">Sign in</a>
          </Button>
        )}
      </div>
    </header>
  );
};

MobileMarketingHeader.displayName = "MobileMarketingHeader";
