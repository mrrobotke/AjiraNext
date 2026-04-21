import React from "react";
import { cn } from "@/lib/utils";

export interface Tab {
  id: string;
  label: string;
}

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className,
  ...rest
}) => {
  return (
    <div
      className={cn("flex gap-0.5 border-b border-border", className)}
      {...rest}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "px-4 py-3 font-bold text-sm border-b-2 -mb-px transition-colors duration-150",
            activeTab === tab.id
              ? "text-fg border-primary"
              : "text-fg-muted border-transparent hover:text-fg"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

Tabs.displayName = "Tabs";
