import React from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface AuthPageTemplateProps {
  sidebar?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Main template                                                      */
/* ------------------------------------------------------------------ */

export const AuthPageTemplate: React.FC<AuthPageTemplateProps> = ({
  sidebar,
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-bg",
        className,
      )}
    >
      {sidebar}
      <main className="flex flex-col justify-center min-w-0">{children}</main>
    </div>
  );
};

AuthPageTemplate.displayName = "AuthPageTemplate";
