import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Checkbox } from '@codevs/ui/checkbox';

const meta = {
  title: 'ShadCN-Atomic/Checkbox',
  component: Checkbox,
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
      description: 'Checkbox sizes',
      options: ['default', 'sm', 'lg', 'icon'],
    },
    disabled: {
      control: 'boolean',
    },
    onClick: {
      action: 'onClick',
      description: 'Function called when the checkbox is clicked',
    },
    className: {
      control: 'text',
      description: 'Custom classes to apply to the checkbox component',
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    className: 'shadow-lg',
    size: 'lg',
    disabled: false,
    onClick: action('checkbox click'),
  },
};
