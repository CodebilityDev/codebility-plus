import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import { action } from '@storybook/addon-actions'
import { Button } from '@codevs/ui/button'
// import { IoAddCircle } from 'react-icons/io5'

const meta = {
  title: 'ShadCN-Atomic/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    viewport: {
      disabled: true,
    }
  },
  argTypes: {
    size: {
			control: 'select',
			description: 'Button sizes',
			options: ['default', 'sm', 'lg', 'icon']
		},
		disabled: {
			control: 'boolean'
		},
		onClick: {
			action: 'onClick',
			description: 'Function called when the default button is clicked'
		},
		children: {
			control: 'text',
			description: 'Content to be displayed inside the button'
		},
		className: {
			control: 'text',
			description: 'Custom tailwind CSS classes to be applied to the button'
		},
    variant: {
      control: 'select',
      description: 'Button color variants',
      options: ['default', 'primary', 'secondary', 'destructive', 'success'],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StartTimer: Story = {
	args: {
    variant: 'primary',
		size: 'lg',
		disabled: false,
		onClick: action('StartTimer click'),
		children: 'Start Timer',
		className: "inline-flex w-full items-center justify-center duration-300 px-6 py-2 whitespace-nowrap rounded-md text-md lg:text-lg ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-100 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-100 text-white hover:bg-blue-200 h-10"
	}
};

export const AddNewBoard: Story = {
	args: {
    variant: 'primary',
		size: 'lg',
		disabled: false,
		onClick: action('AddNewBoard click'),
		children: 'Add New Board',
		className: "justify-center duration-300 px-6 py-2 whitespace-nowrap rounded-md text-md lg:text-lg ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-100 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-100 text-white hover:bg-blue-200 h-10 flex w-max items-center gap-2"
	},
};

export const Default: Story = {
  args: {
    variant: 'default',
    size: 'lg',
    disabled: false,
    onClick: action('default click'),
    children: 'Default Button',
    className: "shadow-lg"
  },
};

export const Primary: Story = {
	args: {
    variant: 'primary',
		size: 'lg',
		disabled: false,
		onClick: action('destructive click'),
		children: 'Default Button',
		className: 'shadow-lg'
	}
};

export const Secondary: Story = {
	args: {
    variant: 'secondary',
		size: 'lg',
		disabled: false,
		onClick: action('secondary click'),
		children: 'Secondary Button',
		className: 'shadow-lg'
	}
};

