import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Card } from '@codevs/ui/card';

const meta = {
  title: 'ShadCN-Atomic/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    viewport: {
      disabled: true,
    },
  },
  argTypes: {
    size: {
      control: 'select',
      description: 'Card sizes (if applicable)',
      options: ['default', 'sm', 'lg', 'icon'],
    },
    onClick: {
      action: 'onClick',
      description: 'Function called when the card is clicked (if the card is clickable)',
    },
    children: {
      control: 'text',
      description: 'Content to be displayed inside the card',
    },
    className: {
      control: 'text',
      description: 'Custom classes to apply to the card component',
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 'default',
    children: 'Default card content',
    className: 'shadow-lg p-4', // Example of a default style
  },
  render: (args) => (
    <Card className={args.className} onClick={args.onClick}>
      {args.children}
    </Card>
  ),
};
