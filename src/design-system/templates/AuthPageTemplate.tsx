import React from "react";
import { cn } from "@/lib/utils";
import { Logo } from "@/design-system/atoms/Logo";

export interface AuthPageTemplateProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthPageTemplate: React.FC<AuthPageTemplateProps> = ({
  children,
  title,
  subtitle,
  className,
  ...rest
}) => {
  return (
    <div
      className={cn(
        "min-h-screen flex items-center justify-center px-6 py-12",
        className
      )}
      {...rest}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo className="mx-auto mb-6" />
          <h1 className="text-2xl font-extrabold text-fg mb-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-fg-muted">{subtitle}</p>
          )}
        </div>
        <div className="bg-card border border-border rounded-2xl p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

AuthPageTemplate.displayName = "AuthPageTemplate";
