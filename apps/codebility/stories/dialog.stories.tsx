import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Dialog } from '@codevs/ui/dialog';

const meta = {
  title: 'ShadCN-Atomic/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    viewport: {
      disabled: true,
    },
  },
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Whether the dialog is open',
    },
    onClose: {
      action: 'onClose',
      description: 'Function called when the dialog is closed',
    },
    className: {
      control: 'text',
      description: 'Custom classes to apply to the dialog container',
    },
    children: {
      control: 'text',
      description: 'Content to be displayed inside the dialog',
    },
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    open: true,
    children: 'Default dialog content',
    className: 'shadow-lg p-4', // Example of a default style
  },
  render: (args) => args.open && (
    <Dialog className={args.className} onClose={args.onClose}>
      {args.children}
    </Dialog>
  ),
};
