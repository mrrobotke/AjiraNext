import React from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  initials?: string;
  size?: "sm" | "md" | "lg";
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  initials,
  size = "md",
  className,
  ...rest
}) => {
  const sizeClasses = {
    sm: "w-7 h-7 text-2xs",
    md: "w-9 h-9 text-xs",
    lg: "w-14 h-14 text-lg",
  };

  return (
    <div
      className={cn(
        "rounded-full bg-primary text-primary-fg flex items-center justify-center font-black overflow-hidden flex-shrink-0",
        sizeClasses[size],
        className
      )}
      aria-label={initials ? `Avatar for ${initials}` : "Avatar"}
      {...rest}
    >
      {src ? (
        <img
          src={src}
          alt=""
          className="w-full h-full object-cover"
        />
      ) : (
        initials
      )}
    </div>
  );
};

Avatar.displayName = "Avatar";
