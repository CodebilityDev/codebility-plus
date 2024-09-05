import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import { AddButton } from "./add-button";

const meta = {
  title: "Example/AddButton",
  component: AddButton,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
  args: {},
} satisfies Meta<typeof AddButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedOut: Story = {};
