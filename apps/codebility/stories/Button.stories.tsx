import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import { action } from '@storybook/addon-actions'
import { Button } from '@codevs/ui/button'

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
    }
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'default',
    size: 'lg',
    disabled: false,
    onClick: action('default click'),
    children: 'Default Button',
    className: 'shadow-lg bg-green-600 text-white'
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

export const StartTimer: Story = {
	args: {
    variant: 'secondary',
		size: 'lg',
		disabled: false,
		onClick: action('secondary click'),
		children: 'Start Timer',
		className: 'bg-blue-100 hover:bg-blue-200 text-white'
	}
};