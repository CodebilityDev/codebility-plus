import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from '@codevs/ui/dropdown-menu';
import { Button } from '@codevs/ui/button';

const meta = {
  title: 'ShadCN-Atomic/DropdownMenu',
  component: DropdownMenu,
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
      description: 'Whether the dropdown menu is open',
    },
    onClose: {
      action: 'onClose',
      description: 'Function called when the dropdown menu is closed',
    },
    className: {
      control: 'text',
      description: 'Custom classes to apply to the dropdown menu container',
    },
    children: {
      control: 'text',
      description: 'Content to be displayed inside the dropdown menu',
    },
  },
} satisfies Meta<typeof DropdownMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(args.open);

    const toggleDropdown = () => {
      setIsOpen(!isOpen);
      if (!isOpen) {
        args.onClose();
      }
    };

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className='bg-blue-100 hover:bg-blue-200' onClick={toggleDropdown}>
            Click me to Test
          </Button>
        </DropdownMenuTrigger>
        {isOpen && (
          <DropdownMenuContent className={args.className} sideOffset={4}>
            <DropdownMenuLabel>Label</DropdownMenuLabel>
            <DropdownMenuItem onSelect={() => console.log('Item 1 selected')}>
              Item 1
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => console.log('Item 2 selected')}>
              Item 2
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked
              onCheckedChange={(checked) => console.log('Checkbox checked:', checked)}
            >
              Checkbox Item
            </DropdownMenuCheckboxItem>
            <DropdownMenuRadioGroup value="1">
              <DropdownMenuRadioItem value="1">Radio Item 1</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="2">Radio Item 2</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Submenu</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Submenu Item 1</DropdownMenuItem>
                <DropdownMenuItem>Submenu Item 2</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuShortcut>Shortcut</DropdownMenuShortcut>
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    );
  },
  args: {
    open: false, // Initial state
    onClose: action('onClose'),
    children: 'Dropdown menu content',
    className: 'p-2 shadow-lg rounded-md', // Example of a default style
  },
};
