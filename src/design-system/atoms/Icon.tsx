import React from "react";
import * as LucideIcons from "lucide-react";

export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  name: keyof typeof LucideIcons;
  size?: number;
  strokeWidth?: number;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 18,
  strokeWidth = 1.75,
  className,
  ...rest
}) => {
  const LucideIcon = LucideIcons[name] as React.FC<{
    size?: number;
    strokeWidth?: number;
    className?: string;
  }>;
  if (!LucideIcon) return null;
  return (
    <LucideIcon
      size={size}
      strokeWidth={strokeWidth}
      className={className}
      {...(rest as any)}
    />
  );
};

Icon.displayName = "Icon";
