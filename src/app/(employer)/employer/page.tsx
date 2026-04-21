import { EmployerDashboardTemplate } from "@/design-system/templates/EmployerDashboardTemplate";
import { StatsRow } from "@/design-system/organisms/StatsRow";

export default function EmployerPage() {
  return (
    <EmployerDashboardTemplate activeTab="dashboard">
      <h1 className="text-3xl font-extrabold text-fg mb-1">
        Dashboard
      </h1>
      <p className="text-sm text-fg-muted mb-6">
        Manage your jobs and candidates.
      </p>
      <StatsRow
        stats={[
          { label: "Active Jobs", value: "6", icon: "Briefcase" },
          { label: "Total Applicants", value: "124", icon: "Users", trend: "up", trendLabel: "+18" },
          { label: "Interviews", value: "8", icon: "MessageCircle" },
          { label: "Hires", value: "3", icon: "Award", trend: "up", trendLabel: "+1" },
        ]}
      />
    </EmployerDashboardTemplate>
  );
}
