import type { Metadata } from "next";
import { HeroSection } from "@/design-system/organisms/HeroSection";

export const metadata: Metadata = {
  title: "Find Your Next Big Role",
};

export default function HomePage() {
  return (
    <HeroSection
      eyebrow="Precision Search"
      title="Find Your Next Big Role with Precision."
      subtitle="The elite career platform for high-impact professionals. Leverage precision matching and editorial-grade job insights to land your definitive role."
      ctaPrimary={{ label: "Explore Jobs" }}
      ctaSecondary={{ label: "For Employers" }}
      searchCells={[
        { label: "Role or keyword", placeholder: "Senior Product Manager" },
        { label: "Location", placeholder: "Nairobi, Kenya" },
      ]}
      searchChips={["Product", "Engineering", "Design", "Data"]}
      stats={[
        { value: "62+", label: "Active Jobs" },
        { value: "36+", label: "Employers" },
        { value: "12k+", label: "Placed This Year" },
        { value: "50k+", label: "Registered Users" },
      ]}
    />
  );
}
