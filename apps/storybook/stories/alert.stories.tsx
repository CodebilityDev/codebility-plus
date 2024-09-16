import { Meta, StoryObj } from '@storybook/react';
import { Alert, AlertTitle, AlertDescription } from '@codevs/ui/alert';
import { Terminal, AlertCircle } from "lucide-react"

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
        <Terminal className="h-4 w-4" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          You can add components to your app using the cli.
        </AlertDescription>
      </>
    ),
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: (
      <>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Your session has expired. Please log in again.
        </AlertDescription>
      </>
    ),
    className: 'w-full max-w-md',
  },
};
