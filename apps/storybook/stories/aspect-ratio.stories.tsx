import { Meta, StoryObj } from '@storybook/react';
import Image from 'next/image';
import { AspectRatio } from '@codevs/ui/aspect-ratio';

const meta: Meta<typeof AspectRatio> = {
  title: 'ShadCN-Atomic/Aspect Ratio',
  component: AspectRatio,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    viewport: {
      disabled: true,
    },
  },
  argTypes: {
    ratio: {
      control: 'number',
      description: 'The aspect ratio (width / height) of the container.',
      defaultValue: 16 / 9,
    },
    className: {
      control: 'text',
      description: 'Additional classes for styling the aspect ratio container.',
    },
    children: {
      control: 'text',
      description: 'Content to be displayed inside the aspect ratio container.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof AspectRatio>;

export const Default: Story = {
  args: {
    ratio: 16 / 9,
    children: (
      <Image
        src="https://images.unsplash.com/photo-1576075796033-848c2a5f3696?w=800&dpr=2&q=80"
        alt="Photo by Alvaro Pinot"
        fill
        className="rounded-md object-cover"
      />
    ),
    className: 'bg-slate-50 dark:bg-slate-800',
  },
};
