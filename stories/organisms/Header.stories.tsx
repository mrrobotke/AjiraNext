import type { Meta, StoryObj } from "@storybook/react";
import { Header } from "@/design-system/organisms/Header";

const meta: Meta<typeof Header> = {
  title: "Organisms/Header",
  component: Header,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Header>;

export const Default: Story = {};

export const ActiveJobs: Story = {
  args: { activeLink: "Jobs" },
};

export const WithThemeToggle: Story = {
  args: { activeLink: "Home", onThemeToggle: () => {}, theme: "dark" },
};
