import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@codevs/ui/dialog';
import { Button } from '@codevs/ui/button';

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
  render: (args) => {
    const [isOpen, setIsOpen] = useState(args.open);

    const toggleDialog = () => {
      setIsOpen(!isOpen);
      if (!isOpen) {
        args.onClose();
      }
    };

    return (
      <div>
        <Button className='bg-blue-100 hover:bg-blue-200' onClick={toggleDialog}>
          {isOpen ? 'Close Dialog' : 'Open Dialog'}
        </Button>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className={args.className}>
            <DialogHeader>
              <DialogTitle>ShadCN Dialog Title</DialogTitle>
              <DialogDescription>
                This is a sample description of the dialog. It provides additional context and details.
              </DialogDescription>
            </DialogHeader>
            {args.children || 'Default dialog content'}
            <DialogFooter>
              <Button onClick={toggleDialog} className="bg-red-100 hover:bg-red-200">
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  },
  args: {
    open: false, // Initial state
    onClose: action('onClose'),
    children: 'Default dialog content',
    className: 'shadow-lg p-4', // Example of a default style
  },
};
