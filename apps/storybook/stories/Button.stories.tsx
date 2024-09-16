import { Meta, StoryObj } from "@storybook/react";
import { Button } from "@codevs/ui/button";
import { Mail, Loader2 } from "lucide-react";

const meta: Meta<typeof Button> = {
  title: "ShadCN-Atomic/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive", "outline", "secondary", "ghost", "link"],
      description: "The variant of the button.",
      defaultValue: "default",
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon"],
      description: "The size of the button.",
      defaultValue: "default",
    },
    asChild: {
      control: "boolean",
      description: "Whether the button is rendered as a child component.",
    },
    children: {
      control: "text",
      description: "Content inside the button.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
		variant: "default",
    children: "Button",
		className: "text-white",
  },
};

export const Secondary: Story = {
	args: {
		variant: "secondary",
		children: "Button",
	},
};

export const Destructive: Story = {
	args: {
		variant: "destructive",
		children: "Button",
	},
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline",
  },
};

export const Subtle: Story = {
  args: {
    variant: "subtle",
    children: "Subtle",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Ghost",
  },
};

export const Link: Story = {
  args: {
    variant: "link",
    children: "Link",
  },
};

export const WithIcon: Story = {
  args: {
		variant: "secondary",
    children: (
      <>
        <Mail className="mr-2 h-4 w-4" />
        Login with Email
      </>
    ),
  },
};

export const Icon: Story = {
	args: {
		size: "icon",
		variant: "secondary",
		children: (
			<>
				<Mail />
			</>
		),
	},
}

export const Loading: Story = {
  args: {
    disabled: true,
		size: "default",
		variant: "outline",
    children: (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Button
      </>
    ),
  },
};
