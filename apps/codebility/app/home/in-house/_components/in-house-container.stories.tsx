import { Meta, StoryObj } from "@storybook/react";
import InHouseContainer from "./in-house-container";
import { mockCodevData } from '@/app/home/_data/in-house-container-data';
import { Codev } from "@/types/home/codev";


const meta: Meta<typeof InHouseContainer> = {
  title: "Home/InHouse/InHouseContainer",
  component: InHouseContainer,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof InHouseContainer>;

export const Default: Story = {
  args: {
    codevData: mockCodevData,
  }
};

