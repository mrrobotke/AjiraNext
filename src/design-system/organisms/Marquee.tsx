import React from "react";
import { cn } from "@/lib/utils";

export interface MarqueeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  items: string[];
  speed?: "slow" | "normal" | "fast";
}

export const Marquee: React.FC<MarqueeProps> = ({
  items,
  speed = "normal",
  className,
  ...rest
}) => {
  const speedClasses = {
    slow: "duration-[40s]",
    normal: "duration-[35s]",
    fast: "duration-[25s]",
  };

  const content = (
    <>
      {items.map((item, i) => (
        <span
          key={i}
          className="text-lg font-extrabold tracking-tight text-fg-muted opacity-70 whitespace-nowrap"
        >
          {item}
        </span>
      ))}
    </>
  );

  return (
    <div
      className={cn(
        "py-10 border-y border-border overflow-hidden",
        "[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]",
        className
      )}
      {...rest}
    >
      <div
        className={cn(
          "flex gap-16 whitespace-nowrap animate-marquee",
          speedClasses[speed]
        )}
        style={{ animationIterationCount: "infinite", animationTimingFunction: "linear" }}
      >
        {content}
        {content}
      </div>
    </div>
  );
};

Marquee.displayName = "Marquee";
