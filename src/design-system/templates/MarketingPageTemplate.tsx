import React from "react";
import { cn } from "@/lib/utils";
import { Header } from "@/design-system/organisms/Header";
import { Footer } from "@/design-system/organisms/Footer";

export interface MarketingPageTemplateProps extends React.HTMLAttributes<HTMLDivElement> {
  activeLink?: string;
  children: React.ReactNode;
  user?: { email?: string } | null;
  dashboardHref?: string | null;
}

export const MarketingPageTemplate: React.FC<MarketingPageTemplateProps> = ({
  activeLink,
  children,
  user,
  dashboardHref,
  className,
  ...rest
}) => {
  return (
    <div className={cn("min-h-screen flex flex-col", className)} {...rest}>
      <Header
        activeLink={activeLink}
        user={user}
        dashboardHref={dashboardHref}
      />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

MarketingPageTemplate.displayName = "MarketingPageTemplate";
