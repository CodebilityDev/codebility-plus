import { Meta, StoryObj } from '@storybook/react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@codevs/ui/accordion';

const meta: Meta<typeof Accordion> = {
  title: 'ShadCN-Atomic/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    viewport: {
      disabled: true,
    },
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['single', 'multiple'],
      description: 'The type of Accordion - single or multiple open items.',
      defaultValue: 'single',
    },
    collapsible: {
      control: 'boolean',
      description: 'Allows all items to be collapsed (when type is single).',
      defaultValue: true,
    },
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  args: {
    type: 'single',
    collapsible: true,
    className: 'w-full',
    children: (
      <>
        <AccordionItem value="item-1">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>
            Yes. It adheres to the WAI-ARIA design pattern.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Is it styled?</AccordionTrigger>
          <AccordionContent>
            Yes. It comes with default styles that matches the other
            components&apos; aesthetic.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Is it animated?</AccordionTrigger>
          <AccordionContent>
            Yes. It&apos;s animated by default, but you can disable it if you
            prefer.
          </AccordionContent>
        </AccordionItem>
      </>
    ),
  },
};
