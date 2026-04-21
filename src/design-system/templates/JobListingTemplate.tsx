import React from "react";
import { cn } from "@/lib/utils";
import { Header } from "@/design-system/organisms/Header";
import { Footer } from "@/design-system/organisms/Footer";
import { FilterPanel } from "@/design-system/organisms/FilterPanel";
import { JobCard } from "@/design-system/organisms/JobCard";

export interface JobListingTemplateProps
  extends React.HTMLAttributes<HTMLDivElement> {
  jobs: React.ComponentProps<typeof JobCard>["job"][];
}

export const JobListingTemplate: React.FC<JobListingTemplateProps> = ({
  jobs,
  className,
  ...rest
}) => {
  return (
    <div className={cn("min-h-screen flex flex-col", className)} {...rest}>
      <Header activeLink="Jobs" />
      <main className="flex-1 max-w-page mx-auto w-full px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          <FilterPanel />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

JobListingTemplate.displayName = "JobListingTemplate";
