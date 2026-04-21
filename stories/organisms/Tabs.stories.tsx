import type { Meta, StoryObj } from "@storybook/react";
import { Tabs } from "@/design-system/organisms/Tabs";
import { useState } from "react";

const meta: Meta<typeof Tabs> = {
  title: "Organisms/Tabs",
  component: Tabs,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => {
    const [active, setActive] = useState("overview");
    return (
      <Tabs
        tabs={[
          { id: "overview", label: "Overview" },
          { id: "matches", label: "Matches" },
          { id: "applications", label: "Applications" },
          { id: "resume", label: "Resume" },
        ]}
        activeTab={active}
        onChange={setActive}
      />
    );
  },
};

export const Light: Story = {
  ...Default,
  globals: { theme: "light" },
};
