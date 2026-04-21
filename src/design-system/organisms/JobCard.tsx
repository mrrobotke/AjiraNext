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
        "bg-card border border-border rounded-2xl p-5 flex flex-col gap-3 cursor-pointer",
        "transition-all duration-200 hover:shadow-md hover:-translate-y-0.5",
        className
      )}
      {...rest}
    >
      <div className="flex justify-between items-start gap-2.5">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-sm text-white"
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
        <p className="text-sm text-fg-muted font-semibold">
          {job.companyName} · {job.location}
        </p>
      </div>
      <JobMeta
        items={[
          { icon: "DollarSign", text: job.salary },
          { icon: "Clock", text: `${job.posted} · ${job.level}` },
        ]}
      />
      <div className="flex items-center justify-between mt-auto pt-2.5 border-t border-border">
        {job.matchScore !== undefined && (
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-full bg-primary/12 text-primary flex items-center justify-center text-2xs font-black">
              {job.matchScore}
            </div>
            <span className="text-2xs font-bold text-fg-muted uppercase tracking-wide">
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
