import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import Card from './in-house-card';
import { Codev } from '@/types/home/codev';

const meta: Meta<typeof Card> = {
  title: 'Components/InHouseCard',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    member: { control: 'object' },
    handleEditButton: { action: 'editButtonClicked' },
  },
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

const mockCodev: Codev = {
  id: '1',
  first_name: 'John',
  last_name: 'Doe',
  internal_status: 'AVAILABLE',
  main_position: 'Senior Developer',
  projects: [{ id: 'p1', name: 'Project A' }, { id: 'p2', name: 'Project B' }],
  nda_status: 'Signed',
  email: 'john.doe@example.com',
  user_id: 'u1',
  image_url: 'https://example.com/avatar.jpg',
  address: '123 Main St',
  about: 'Experienced developer',
  contact: '123-456-7890',
  education: 'BS Computer Science',
  socials: { linkedin: 'https://linkedin.com/johndoe' },
  tech_stacks: ['React', 'Node.js'],
  job_status: 'Active',
  portfolio_website: 'https://johndoe.dev',
  user: {} as any, // Simplified for this example
};

export const Default: Story = {
  args: {
    member: mockCodev,
    handleEditButton: (id: string) => console.log('Edit button clicked for id:', id),
  },
};

export const Deployed: Story = {
  args: {
    ...Default.args,
    member: {
      ...mockCodev,
      internal_status: 'DEPLOYED',
    },
  },
};

export const NoProjects: Story = {
  args: {
    ...Default.args,
    member: {
      ...mockCodev,
      projects: [],
    },
  },
};