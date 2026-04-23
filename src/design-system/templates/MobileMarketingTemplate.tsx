"use client";

import React, { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { MobileMarketingHeader } from "@/design-system/organisms/MobileMarketingHeader";
import { MobileNavDrawer } from "@/design-system/organisms/MobileNavDrawer";
import { Footer } from "@/design-system/organisms/Footer";

export interface MobileMarketingTemplateProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  user?: { email?: string } | null;
  dashboardHref?: string | null;
}

export const MobileMarketingTemplate: React.FC<
  MobileMarketingTemplateProps
> = ({ children, user, dashboardHref, className, ...rest }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  return (
    <div
      className={cn("min-h-screen flex flex-col md:hidden", className)}
      {...rest}
    >
      <MobileMarketingHeader
        onMenuToggle={toggleMenu}
        menuOpen={menuOpen}
        user={user}
        dashboardHref={dashboardHref}
      />
      <MobileNavDrawer
        open={menuOpen}
        onClose={closeMenu}
        user={user}
        dashboardHref={dashboardHref}
      />
      <main inert={menuOpen ? true : undefined}>{children}</main>
      <Footer />
    </div>
  );
};

MobileMarketingTemplate.displayName = "MobileMarketingTemplate";
