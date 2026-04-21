import type { Meta, StoryObj } from "@storybook/react";
import { UserProfileSnippet } from "@/design-system/molecules/UserProfileSnippet";

const meta: Meta<typeof UserProfileSnippet> = {
  title: "Molecules/UserProfileSnippet",
  component: UserProfileSnippet,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof UserProfileSnippet>;

export const Default: Story = {
  args: { name: "Amina Okafor", role: "Job Seeker" },
};

export const WithImage: Story = {
  args: { name: "Amina Okafor", role: "Job Seeker", avatarSrc: "/assets/av-w1.jpg" },
};
