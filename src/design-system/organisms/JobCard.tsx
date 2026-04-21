import React from "react";
import { cn } from "@/lib/utils";
import { Heading } from "@/design-system/atoms/Heading";
import { Chip } from "@/design-system/atoms/Chip";
import { Button } from "@/design-system/atoms/Button";
import { JobMeta } from "@/design-system/molecules/JobMeta";

export interface JobCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  job: {
    id: string;
    title: string;
    companyName: string;
    companyLogo: string;
    companyColor: string;
    location: string;
    type: string;
    level: string;
    salary: string;
    posted: string;
    featured?: string;
    matchScore?: number;
  };
  onClick?: () => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  onClick,
  className,
  ...rest
}) => {
  const chipVariant =
    job.featured === "Urgent"
      ? "red"
      : job.featured === "New"
      ? "green"
      : "accent";

  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 flex flex-col gap-3 cursor-pointer",
        "transition-all duration-200 hover:shadow-md hover:-translate-y-0.5",
        className
      )}
      {...rest}
    >
      <div className="flex justify-between items-start gap-2.5">
        <div
          className="w-10 h-10 rounded-[10px] flex items-center justify-center font-black text-[0.9375rem] text-white"
          style={{ background: job.companyColor }}
        >
          {job.companyLogo}
        </div>
        {job.featured && (
          <Chip variant={chipVariant as "red" | "green" | "accent"}>
            {job.featured}
          </Chip>
        )}
      </div>
      <div>
        <Heading as="h4" size="lg" weight="extrabold" className="mb-1">
          {job.title}
        </Heading>
        <p className="text-[0.8125rem] text-[var(--fg-muted)] font-semibold">
          {job.companyName} · {job.location}
        </p>
      </div>
      <JobMeta
        items={[
          { icon: "DollarSign", text: job.salary },
          { icon: "Clock", text: `${job.posted} · ${job.level}` },
        ]}
      />
      <div className="flex items-center justify-between mt-auto pt-2.5 border-t border-[var(--border)]">
        {job.matchScore !== undefined && (
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-full bg-[hsl(155_100%_42%_/0.12)] text-[var(--primary)] flex items-center justify-center text-[0.625rem] font-black">
              {job.matchScore}
            </div>
            <span className="text-[0.6875rem] font-bold text-[var(--fg-muted)] uppercase tracking-[0.06em]">
              Match
            </span>
          </div>
        )}
        <Button size="sm">Apply</Button>
      </div>
    </div>
  );
};

JobCard.displayName = "JobCard";
