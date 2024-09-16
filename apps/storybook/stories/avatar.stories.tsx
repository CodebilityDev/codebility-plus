import { Meta, StoryObj } from '@storybook/react';
import { Avatar, AvatarImage, AvatarFallback } from '@codevs/ui/avatar';  // Adjust the import path as necessary

const meta: Meta<typeof Avatar> = {
  title: 'ShadCN-Atomic/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    viewport: {
      disabled: true,
    },
  },
  argTypes: {
    src: {
      control: 'text',
      description: 'Source URL for the avatar image.',
      defaultValue: 'https://github.com/shadcn.png',
    },
    alt: {
      control: 'text',
      description: 'Alternative text for the avatar image.',
      defaultValue: 'User Avatar',
    },
    fallback: {
      control: 'text',
      description: 'Fallback text when the image cannot be loaded.',
      defaultValue: 'CN',
    },
    className: {
      control: 'text',
      description: 'Additional classes for styling the avatar.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  args: {
    children: (
      <>
        <AvatarImage src="https://github.com/shadcn.png" alt="User Avatar" />
        <AvatarFallback>CN</AvatarFallback>
      </>
    ),
    className: 'h-10 w-10',
  },
};
