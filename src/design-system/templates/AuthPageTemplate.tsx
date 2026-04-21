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
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-8">
          <Logo className="mx-auto mb-6" />
          <h1 className="text-2xl font-extrabold text-[var(--fg)] mb-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[0.875rem] text-[var(--fg-muted)]">{subtitle}</p>
          )}
        </div>
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

AuthPageTemplate.displayName = "AuthPageTemplate";
