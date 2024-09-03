import { Meta, StoryObj } from "@storybook/react";
import { Calendar } from "@codevs/ui/calendar";

const meta: Meta<typeof Calendar> = {
  title: "ShadCN-Atomic/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  argTypes: {
    className: {
      control: "text",
      description: "Additional classes for styling the calendar component.",
    },
    showOutsideDays: {
      control: "boolean",
      description: "Whether to show days outside of the current month.",
      defaultValue: true,
    },
    classNames: {
      control: "object",
      description: "Custom class names for the calendar elements.",
    },
  },
  parameters: {
    layout: "centered",
    viewport: {
      defaultViewport: "responsive",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
  args: {
    showOutsideDays: true,
    className: "rounded-md border w-fit",
    mode: "single",
    onSelect: (date) => console.log(date),
    selected: new Date(),
  },
};

export const Multiple: Story = {
  args: {
    showOutsideDays: true,
    className: "rounded-md border w-fit",
    min: 1,
    mode: "multiple",
    onSelect: (date) => console.log(date),
    selected: [
      new Date(),
      new Date(new Date().setDate(new Date().getDate() + 3)),
      new Date(new Date().setDate(new Date().getDate() + 6)),
    ],
  },
};

export const CustomStyling: Story = {
  args: {
    className: "bg-white border rounded-lg p-4",
    showOutsideDays: true,
    classNames: {
      day_today: "bg-yellow-500 text-white",
      day_selected: "bg-blue-500 text-white",
    },
  },
};

export const Range: Story = {
  args: {
    showOutsideDays: true,
    className: "rounded-md border w-fit",
    classNames: {
      day_today: "bg-yellow-500 text-white",
      day_selected: "bg-blue-500 text-white",
    },
    min: 1,
    mode: "range",
    onSelect: (date) => console.log(date),
    selected: [
      {
        from: new Date(),
        to: new Date(new Date().setDate(new Date().getDate() + 7)),
      }
    ],
  },
};

export const Disabled: Story = {
  args: {
    showOutsideDays: true,
    className: "rounded-md border w-fit",
    mode: "single",
    onSelect: (date) => console.log(date),
    selected: new Date(),
    disabled: [
      new Date(),
      new Date(new Date().setDate(new Date().getDate() + 1)),
      new Date(new Date().setDate(new Date().getDate() + 2)),
      new Date(new Date().setDate(new Date().getDate() + 3)),
      new Date(new Date().setDate(new Date().getDate() + 6)),
    ],
  },
}

export const HideOutsideDays: Story = {
  args: {
    showOutsideDays: false,
  },
};

// export const WithCustomIcons: Story = {
//   args: {
//     showOutsideDays: true,
//     components: {
//       IconLeft: ({ ...props }) => <ChevronLeft className="h-6 w-6" />,
//       IconRight: ({ ...props }) => <ChevronRight className="h-6 w-6" />,
//     },
//   },
// };
