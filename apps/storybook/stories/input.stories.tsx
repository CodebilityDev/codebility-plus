import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '@codevs/ui/input';

const meta = {
  title: 'ShadCN-Atomic/Input',
  component: Input,
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
      description: 'Input sizes',
      options: ['default', 'sm', 'lg', 'icon'],
    },
    disabled: {
      control: 'boolean',
    },
    onClick: {
      action: 'onClick',
      description: 'Function called when the input is clicked',
    },
    children: {
      control: 'text',
      description: 'Content to be displayed inside the input',
    },
    label: {
      control: 'text',
      description: 'Label for the input field',
    },
    variant: {
      control: 'select',
      description: 'Input variant styles',
      options: ['default', 'resume', 'lightgray', 'darkgray'],
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 'default',
    children: '',
    className: 'shadow-lg p-4',
    label: 'Username',
    variant: 'default',
  },
  render: (args) => <Input {...args} />,
};
