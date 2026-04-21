import type { Meta, StoryObj } from "@storybook/react";
import { MarketingPageTemplate } from "@/design-system/templates/MarketingPageTemplate";
import { HeroSection } from "@/design-system/organisms/HeroSection";

const meta: Meta<typeof MarketingPageTemplate> = {
  title: "Templates/MarketingPageTemplate",
  component: MarketingPageTemplate,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof MarketingPageTemplate>;

export const Default: Story = {
  args: {
    activeLink: "Home",
    children: (
      <HeroSection
        eyebrow="Precision Search"
        title="Find Your Next Big Role with Precision."
        subtitle="The elite career platform for high-impact professionals."
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
    ),
  },
};

export const Light: Story = {
  ...Default,
  globals: { theme: "light" },
};
