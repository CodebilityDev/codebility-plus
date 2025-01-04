import React from "react";
import MarketingCard from "@/app/(marketing)/_components/landing/landing-marketing-card";
import { MarketingCardData } from "@/app/(marketing)/_lib/dummy-data";
import { index_MarketingCardT } from "@/types/home";
import { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof MarketingCard> = {
  title: "Components/Marketing Card",
  component: MarketingCard,
  tags: ["autodocs"],
  args: {
    title: "Grow Your Business",
    description: "Discover the tools you need to reach new heights.",
    className:"bg-white/5",
  },
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomBackground: Story = {
  args: {
    title: "Boost Your Productivity",
    description: "Access resources and tools to enhance your workflow.",
    className:"bg-white/5",
  },
};

// Variant with long description
export const LongDescription: Story = {
  args: {
    title: "Supercharge Your Team",
    description:
      "Leverage cutting-edge technologies to empower your team and achieve unparalleled efficiency in every project.",
      className:"bg-white/5",
  },
};

// Render multiple cards
export const MultipleCards: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 bg-[#030303]">
      {MarketingCardData.map((card: index_MarketingCardT, index: number) => (
        <MarketingCard
          key={index}
          title={card.title}
          description={card.description}
          className="bg-white/5"
        />
      ))}
    </div>
  ),
};
