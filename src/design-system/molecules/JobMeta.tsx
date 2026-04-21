import React from "react";
import { cn } from "@/lib/utils";
import { Icon, type IconProps } from "@/design-system/atoms/Icon";
import { Caption } from "@/design-system/atoms/Caption";

export interface JobMetaProps extends React.HTMLAttributes<HTMLDivElement> {
  items: Array<{
    icon?: IconProps["name"];
    text: string;
  }>;
}

export const JobMeta: React.FC<JobMetaProps> = ({
  items,
  className,
  ...rest
}) => {
  return (
    <div
      className={cn("flex flex-wrap items-center gap-x-3 gap-y-1", className)}
      {...rest}
    >
      {items.map((item, i) => (
        <span key={i} className="inline-flex items-center gap-1.5">
          {item.icon && (
            <Icon name={item.icon} size={12} className="text-[var(--fg-muted)]" />
          )}
          <Caption>{item.text}</Caption>
          {i < items.length - 1 && (
            <span className="text-[var(--fg-muted)] ml-1">·</span>
          )}
        </span>
      ))}
    </div>
  );
};

JobMeta.displayName = "JobMeta";
