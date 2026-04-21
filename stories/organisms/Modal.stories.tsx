import type { Meta, StoryObj } from "@storybook/react";
import { Modal } from "@/design-system/organisms/Modal";
import { Button } from "@/design-system/atoms/Button";
import { useState } from "react";

const meta: Meta<typeof Modal> = {
  title: "Organisms/Modal",
  component: Modal,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal</Button>
        <Modal title="Confirm Action" onClose={() => setOpen(false)} open={open}>
          <p className="text-[var(--fg-muted)]">
            Are you sure you want to proceed? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Confirm</Button>
          </div>
        </Modal>
      </>
    );
  },
};
