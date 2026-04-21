import { MarketingPageTemplate } from "@/design-system/templates/MarketingPageTemplate";
import { HeroSection } from "@/design-system/organisms/HeroSection";

export default function HomePage() {
  return (
    <MarketingPageTemplate activeLink="Home">
      <HeroSection
        eyebrow="Precision Search"
        title="Find Your Next Big Role with Precision."
        subtitle="The elite career platform for high-impact professionals. Leverage precision matching and editorial-grade job insights to land your definitive role."
        ctaPrimary={{ label: "Explore Jobs" }}
        ctaSecondary={{ label: "For Employers" }}
        searchPlaceholder="Job title, keyword, or company"
        searchChips={["Product", "Engineering", "Design", "Data"]}
        stats={[
          { value: "62+", label: "Active Jobs" },
          { value: "36+", label: "Employers" },
          { value: "12k+", label: "Placed This Year" },
          { value: "50k+", label: "Registered Users" },
        ]}
      />
    </MarketingPageTemplate>
  );
}
