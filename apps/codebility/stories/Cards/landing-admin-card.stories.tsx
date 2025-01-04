import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import AdminCard from "@/app/(marketing)/_components/landing/landing-admin-card";



const meta: Meta<typeof AdminCard> = {
  title: "Components/Admin Card",
  component: AdminCard,
  tags: ["autodocs"],
  args: {
    admin: {
        id: "232323222",
      first_name: "John",
      last_name: "Doe",
      image_url: "https://img.freepik.com/free-vector/young-prince-royal-attire_1308-176144.jpg?semt=ais_hybrid",
      main_position: "Administrator",

    },
    color: "bg-black-500",
  },
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;


export const Default: Story = {};


export const NoImage: Story = {
  args: {
    admin: {
      id: "123123123",
      first_name: "Jane",
      last_name: "Smith",
      image_url: "",
      main_position: "Developer",
    },
  },
};

// Variant with missing position
export const NoPosition: Story = {
  args: {
    admin: {
        id: "3441241",
      first_name: "Alex",
      last_name: "Johnson",
      image_url: "https://img.freepik.com/free-vector/young-prince-vector-illustration_1308-174367.jpg?semt=ais_hybrid",
      main_position: "",
    },
  },
};

// Render multiple cards
export const MultipleCards: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 bg-[#030303]">
      {[
        { id: "1", first_name: "John", last_name: "Doe", main_position: "Admin", image_url: "https://img.freepik.com/free-vector/young-prince-royal-attire_1308-176144.jpg?semt=ais_hybrid" },
        { id: "2", first_name: "Jane", last_name: "Smith", main_position: "Developer", image_url: "" },
        { id: "3", first_name: "Alex", last_name: "Johnson", main_position: "Designer", image_url: "https://img.freepik.com/free-vector/young-prince-vector-illustration_1308-174367.jpg?semt=ais_hybrid" },
      ].map((admin, index) => (
        <AdminCard key={index}  admin={admin} color="bg-black-500" />
      ))} 
    </div>
  ),
};
