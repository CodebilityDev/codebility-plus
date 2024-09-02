import { Meta, StoryObj } from '@storybook/react';
import { Alert, AlertTitle, AlertDescription } from '@codevs/ui/alert';

const meta: Meta<typeof Alert> = {
  title: 'ShadCN-Atomic/Alert',
  component: Alert,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    viewport: {
      disabled: true,
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      description: 'The variant of the alert.',
      options: ['default', 'destructive'],
      defaultValue: 'default',
    },
    className: {
      control: 'text',
      description: 'Additional classes for styling the alert.',
    },
    children: {
      control: 'text',
      description: 'Content of the alert including title and description.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  args: {
    variant: 'default',
    children: (
      <>
        <AlertTitle>Alert Title</AlertTitle>
        <AlertDescription>
          This is an example of an alert description.
        </AlertDescription>
      </>
    ),
    className: 'w-full max-w-md',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: (
      <>
        <AlertTitle>Destructive Alert Title</AlertTitle>
        <AlertDescription>
          This is an example of a destructive alert description.
        </AlertDescription>
      </>
    ),
    className: 'w-full max-w-md',
  },
};
