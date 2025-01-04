import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import ServicesCard from "@/app/(marketing)/_components/landing/landing-services-card";
import { ServicesCardData } from "@/app/(marketing)/_lib/dummy-data";

const meta: Meta<typeof ServicesCard> = {
  title: "Components/Services Card",
  component: ServicesCard,
  tags: ["autodocs"],
  args: {
    title: "Content Quality",
    description:
      "High-quality content is the cornerstone of any successful website.",
    imageUrl:
      "https://codebility-cdn.pages.dev/assets/images/campaign/content-quality.png",
    imageAlt: "Content Quality",
    className: "bg-[#9747FF] w-[400px]",
  },
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Single Card (Default)
export const Default: Story = {};

// Single Card with Custom Props
export const CustomCard: Story = {
  args: {
    title: "Security",
    description:
      "By prioritizing security, we build trust with your users and protect your reputation.",
    imageUrl:
      "https://codebility-cdn.pages.dev/assets/images/campaign/security.png",
    imageAlt: "Security",
    className: "bg-[#9747FF] w-[400px] mx-auto",
  },
};

// Multiple Cards
export const MultipleCards: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 bg-[#030303] lg:grid-cols-3">
      {ServicesCardData.map((data, index) => (
        <ServicesCard
          key={index}
          imageUrl={data.imageUrl}
          imageAlt={data.imageAlt}
          title={data.title}
          description={data.description}
          className="bg-[#9747FF]"
        />
      ))}
    </div>
  ),
};
