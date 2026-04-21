import { JobSeekerDashboardTemplate } from "@/design-system/templates/JobSeekerDashboardTemplate";
import { StatsRow } from "@/design-system/organisms/StatsRow";

const sidebarGroups = [
  {
    links: [
      {
        icon: "LayoutDashboard" as const,
        label: "Overview",
        href: "/seeker",
        active: true,
      },
      {
        icon: "Target" as const,
        label: "Matches",
        href: "/seeker?tab=matches",
        count: 12,
      },
      {
        icon: "FileText" as const,
        label: "Applications",
        href: "/seeker?tab=applications",
        count: 4,
      },
      { icon: "File" as const, label: "Resume", href: "/seeker?tab=resume" },
      {
        icon: "MessageCircle" as const,
        label: "Interview Prep",
        href: "/seeker?tab=prep",
      },
      {
        icon: "TrendingUp" as const,
        label: "Career Paths",
        href: "/seeker?tab=paths",
      },
      { icon: "User" as const, label: "Profile", href: "/seeker?tab=profile" },
      {
        icon: "CreditCard" as const,
        label: "Billing",
        href: "/seeker?tab=billing",
      },
    ],
  },
];

export default function SeekerPage() {
  return (
    <JobSeekerDashboardTemplate
      activeTab="overview"
      user={{ name: "Amina Okafor", role: "Job Seeker" }}
      sidebarGroups={sidebarGroups}
    >
      <h1 className="text-3xl font-extrabold text-fg mb-1">Overview</h1>
      <p className="text-sm text-fg-muted mb-6">Your job search at a glance.</p>
      <StatsRow
        stats={[
          {
            label: "Profile Views",
            value: "128",
            icon: "Eye",
            trend: "up",
            trendLabel: "+12%",
          },
          { label: "Applications", value: "4", icon: "FileText" },
          {
            label: "Interviews",
            value: "2",
            icon: "MessageCircle",
            trend: "up",
            trendLabel: "+1",
          },
          { label: "Saved Jobs", value: "12", icon: "Bookmark" },
          { label: "Match Score", value: "88", icon: "Target" },
        ]}
      />
    </JobSeekerDashboardTemplate>
  );
}
