import type { Meta, StoryObj } from '@storybook/react';
import * as React from "react"
import { Button } from "@codevs/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@codevs/ui/card"
import { Input } from "@codevs/ui/input"
import { Label } from "@codevs/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@codevs/ui/select"

const meta = {
  title: 'ShadCN-Atomic/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    viewport: {
      disabled: true,
    },
  },
  argTypes: {
    size: {
      control: 'select',
      description: 'Card sizes (if applicable)',
      options: ['default', 'sm', 'lg', 'icon'],
    },
    onClick: {
      action: 'onClick',
      description: 'Function called when the card is clicked (if the card is clickable)',
    },
    children: {
      control: 'text',
      description: 'Content to be displayed inside the card',
    },
    className: {
      control: 'text',
      description: 'Custom classes to apply to the card component',
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 'default',
    children: 'Default card content',
    className: 'shadow-lg p-4', // Example of a default style
  },
  render: (args) => (
    <Card className={args.className} onClick={args.onClick}>
      {args.children}
    </Card>
  ),
};

export const SampleLogin: Story = {
  args: {
    className: 'w-[350px]',
    children: (
      <>
        <CardHeader>
          <CardTitle>Create project</CardTitle>
          <CardDescription>Deploy your new project in one-click.</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Name of your project" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="framework">Framework</Label>
                <Select>
                  <SelectTrigger id="framework">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="next">Next.js</SelectItem>
                    <SelectItem value="sveltekit">SvelteKit</SelectItem>
                    <SelectItem value="astro">Astro</SelectItem>
                    <SelectItem value="nuxt">Nuxt.js</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button className='text-white'>Deploy</Button>
        </CardFooter>
      </>
    ),
  },
}