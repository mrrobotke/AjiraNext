import { JobSeekerDashboardTemplate } from "@/design-system/templates/JobSeekerDashboardTemplate";
import { StatsRow } from "@/design-system/organisms/StatsRow";

export default function SeekerPage() {
  return (
    <JobSeekerDashboardTemplate activeTab="overview">
      <h1 className="text-3xl font-extrabold text-fg mb-1">
        Overview
      </h1>
      <p className="text-sm text-fg-muted mb-6">
        Your job search at a glance.
      </p>
      <StatsRow
        stats={[
          { label: "Profile Views", value: "128", icon: "Eye", trend: "up", trendLabel: "+12%" },
          { label: "Applications", value: "4", icon: "FileText" },
          { label: "Interviews", value: "2", icon: "MessageCircle", trend: "up", trendLabel: "+1" },
          { label: "Saved Jobs", value: "12", icon: "Bookmark" },
          { label: "Match Score", value: "88", icon: "Target" },
        ]}
      />
    </JobSeekerDashboardTemplate>
  );
}
