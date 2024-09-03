import type { Meta, StoryObj } from '@storybook/react';
import * as React from "react";
import { ChevronsUpDown } from "lucide-react";
import { Button } from '@codevs/ui/button';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@codevs/ui/collapsible';

const meta: Meta<typeof Collapsible> = {
  title: 'ShadCN-Atomic/Collapsible',
  component: Collapsible,
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
      description: 'Whether the collapsible is open or not.',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the collapsible is disabled or not.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Collapsible>;

export const Default: Story = {
  args: {
    open: false,
    disabled: false,
    children: (
      <div className="w-full max-w-md p-4 border border-gray-300 rounded-md">
        <Collapsible>
          <CollapsibleTrigger className="w-full px-4 py-2 text-left bg-gray-100 rounded-md">
            Toggle Content
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <div className="p-4 bg-white border border-gray-200 rounded-md">
              This is the collapsible content. It can contain any elements you want to display when the trigger is activated.
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    ),
  },
};

const SampleUsageComponent: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-[350px] space-y-2">
      <div className="flex items-center justify-between space-x-4 px-4">
        <h4 className="text-sm font-semibold">
          @peduarte starred 3 repositories
        </h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-9 p-0">
            <ChevronsUpDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <div className="rounded-md border px-4 py-3 font-mono text-sm">
        @radix-ui/primitives
      </div>
      <CollapsibleContent className="space-y-2">
        <div className="rounded-md border px-4 py-3 font-mono text-sm">
          @radix-ui/colors
        </div>
        <div className="rounded-md border px-4 py-3 font-mono text-sm">
          @stitches/react
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export const SampleUsage: Story = {
  render: () => <SampleUsageComponent />,
};
