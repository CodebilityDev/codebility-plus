import { Meta, StoryObj } from '@storybook/react';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '@codevs/ui/alert-dialog';  // Adjust the import path as necessary

import { Button } from "@codevs/ui/button";

const meta: Meta<typeof AlertDialog> = {
  title: 'ShadCN-Atomic/AlertDialog',
  component: AlertDialog,
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
      description: 'Controls whether the AlertDialog is open or closed.',
      defaultValue: false,
    },
    onOpenChange: {
      action: 'onOpenChange',
      description: 'Callback called when the open state changes.',
    },
    children: {
      control: 'object',
      description: 'Content to be displayed inside the AlertDialog.',
    },
  },
} satisfies Meta<typeof AlertDialog>;

export default meta;
type Story = StoryObj<typeof AlertDialog>;

export const Default: Story = {
  args: {
    open: false,
    children: (
      <>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline">Show Dialog</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    ),
  },
};
