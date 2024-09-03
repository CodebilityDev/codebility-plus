import { Meta, StoryObj } from '@storybook/react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@codevs/ui/carousel';
import { Button } from '@codevs/ui/button';
import { Card, CardContent } from "@codevs/ui/card"

const meta: Meta<typeof Carousel> = {
  title: 'ShadCN-Atomic/Carousel',
  component: Carousel,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: 'The orientation of the carousel.',
      defaultValue: 'horizontal',
    },
    className: {
      control: 'text',
      description: 'Additional classes for styling the carousel container.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Carousel>;

// Default horizontal carousel with 3 slides
export const Default: Story = {
  args: {
    orientation: 'horizontal',
    className: 'w-full max-w-xs',
    children: (
      <>
        <CarouselPrevious />
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-4xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext />
      </>
    ),
  },
};

// Vertical carousel with 2 slides
export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    className: 'w-full max-w-xs',
    opts:{
      align: "start",
    },
    children: (
      <>
        <CarouselPrevious />
        <CarouselContent className="-mt-1 h-[200px]">
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index} className="pt-1 md:basis-1/2">
              <div className="p-1">
                <Card>
                  <CardContent className="flex items-center justify-center p-6">
                    <span className="text-3xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext />
      </>
    ),
  },
};

// Carousel with custom Size
export const Size: Story = {
  args: {
    orientation: 'horizontal',
    className: 'w-full max-w-sm',
    opts:{
      align: "start",
    },
    children: (
      <>
        <CarouselPrevious />
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-3xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext />
      </>
    ),
  },
};

// Carousel with custom Spacing
export const Spacing: Story = {
  args: {
    orientation: 'horizontal',
    className: 'w-full max-w-sm',
    children: (
      <>
        <CarouselPrevious />
        <CarouselContent className="-ml-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-2xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext />
      </>
    ),
  },
};
