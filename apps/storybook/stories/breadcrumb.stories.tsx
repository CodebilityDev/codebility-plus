import type { Meta, StoryObj } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbEllipsis } from '@codevs/ui/breadcrumb'

const meta = {
  title: 'ShadCN-Atomic/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    viewport: {
      disabled: true,
    },
  },
  argTypes: {
    onClick: {
      action: 'onClick',
      description: 'Function called when a breadcrumb item is clicked',
    },
    className: {
      control: 'text',
      description: 'Custom classes for the breadcrumb container',
    },
    separator: {
      control: 'text',
      description: 'Custom separator between breadcrumb items',
    },
    ellipsis: {
      control: 'boolean',
      description: 'Include ellipsis for overflow handling',
    },
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
    separator: "/",
    ellipsis: false,
  },
  render: (args) => (
    <Breadcrumb className={args.className}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Settings</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>{args.separator}</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Roles</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>{args.separator}</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Permission</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>{args.separator}</BreadcrumbSeparator>
        {args.ellipsis && <BreadcrumbEllipsis />}
        <BreadcrumbItem>
          <BreadcrumbLink href="#" aria-current="page">Services</BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};
