import React from "react";
import { cn } from "@/lib/utils";
import { Heading } from "@/design-system/atoms/Heading";
import { Chip } from "@/design-system/atoms/Chip";
import { Button } from "@/design-system/atoms/Button";
import { JobMeta } from "@/design-system/molecules/JobMeta";

export interface JobDetailHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
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
}

export const JobDetailHeader: React.FC<JobDetailHeaderProps> = ({
  title,
  companyName,
  companyLogo,
  companyColor,
  location,
  type,
  level,
  salary,
  posted,
  featured,
  className,
  ...rest
}) => {
  return (
    <div
      className={cn(
        "bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 flex flex-col gap-4",
        className
      )}
      {...rest}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center font-black text-lg text-white"
            style={{ background: companyColor }}
          >
            {companyLogo}
          </div>
          <div>
            <Heading as="h2" size="xl" weight="extrabold">
              {title}
            </Heading>
            <p className="text-[0.875rem] text-[var(--fg-muted)] font-semibold mt-0.5">
              {companyName}
            </p>
          </div>
        </div>
        {featured && <Chip variant="accent">{featured}</Chip>}
      </div>
      <JobMeta
        items={[
          { icon: "MapPin", text: location },
          { icon: "Briefcase", text: type },
          { icon: "BarChart", text: level },
          { icon: "DollarSign", text: salary },
          { icon: "Clock", text: posted },
        ]}
      />
      <div className="flex gap-2 pt-2">
        <Button>Apply Now</Button>
        <Button variant="outline">Save</Button>
        <Button variant="ghost">Share</Button>
      </div>
    </div>
  );
};

JobDetailHeader.displayName = "JobDetailHeader";
