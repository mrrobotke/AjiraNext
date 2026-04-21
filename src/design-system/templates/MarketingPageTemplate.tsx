import React from "react";
import { cn } from "@/lib/utils";
import { Header } from "@/design-system/organisms/Header";
import { Footer } from "@/design-system/organisms/Footer";

export interface MarketingPageTemplateProps
  extends React.HTMLAttributes<HTMLDivElement> {
  activeLink?: string;
  children: React.ReactNode;
}

export const MarketingPageTemplate: React.FC<
  MarketingPageTemplateProps
> = ({ activeLink, children, className, ...rest }) => {
  return (
    <div className={cn("min-h-screen flex flex-col", className)} {...rest}>
      <Header activeLink={activeLink} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

MarketingPageTemplate.displayName = "MarketingPageTemplate";
