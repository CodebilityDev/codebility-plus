// import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import InHouseCards from './in-house-cards';
import { mockData } from './in-house-cards-data';
import { Card } from './in-house-card';
import { Button } from '@codevs/ui/button';
import { Avatar } from '@codevs/ui/avatar';

const meta: Meta<typeof InHouseCards> = {
  title: 'Components/InHouseCards',
  component: InHouseCards,
  tags: ['autodocs'],
  // argTypes: {
  //   data: { control: 'object' },
  //   editableIds: { control: 'array' },
  //   handlers: { control: 'object' },
  //   status: { control: 'object' },
  //   currentPage: { control: 'number' },
  //   totalPages: { control: 'number' },
  //   handlePreviousPage: { action: 'handlePreviousPage' },
  //   handleNextPage: { action: 'handleNextPage' },
  // },
};

export default meta;
export const Default: StoryObj<typeof InHouseCards> = {
  args: {
    data: mockData,
    editableIds: [],
    handlers: {
      handleEditButton: () => {},
      handleSaveButton: () => {},
    },
    // status: {
    //   LoadinginHouse: false,
    //   ErrorinHouse: false,
    // },
    currentPage: 1,
    totalPages: 1,
    handlePreviousPage: () => {},
    handleNextPage: () => {},
  },
  decorators: [
    (Story) => (
      <div className="p-4 bg-gray-100">
        <Story />
      </div>
    ),
  ],
};

// export const Default: Story = {
//   args: {
//     data: mockData,
//     editableIds: [],
//     handlers: {
//       handleEditButton: () => {},
//       handleSaveButton: () => {},
//     },
//     // status: {
//     //   LoadinginHouse: false,
//     //   ErrorinHouse: false,
//     // },
//     currentPage: 1,
//     totalPages: 1,
//     handlePreviousPage: () => {},
//     handleNextPage: () => {},
//   },
//   decorators: [
//     (Story) => (
//       <div className="p-4 bg-gray-100">
//         <Story />
//       </div>
//     ),
//   ],
// };

// export const Loading: Story = {
//   args: {
//     ...Default.args,
//     status: {
//       LoadinginHouse: true,
//       ErrorinHouse: false,
//     },
//   },
// };

// export const Error: Story = {
//   args: {
//     ...Default.args,
//     status: {
//       LoadinginHouse: false,
//       ErrorinHouse: true,
//     },
//   },
// };

// export const WithEditableCard: Story = {
//   args: {
//     ...Default.args,
//     editableIds: [1],
//   },
// };

// // Mock components to simulate the actual components used in InHouseCards
const MockCard = ({ member, handleEditButton }) => (
  <Card className="w-full max-w-sm">
    <div className="flex items-center space-x-4 p-4">
      <Avatar>
        <Avatar.Image src={`https://api.dicebear.com/6.x/initials/svg?seed=${member.name}`} alt={member.name} />
        <Avatar.Fallback>{member.name.charAt(0)}</Avatar.Fallback>
      </Avatar>
      <div>
        <h3 className="text-lg font-semibold">{member.name}</h3>
        <p className="text-sm text-gray-500">{member.role}</p>
      </div>
    </div>
    <div className="p-4">
      <Button onClick={() => handleEditButton(member.id)}>Edit</Button>
    </div>
  </Card>
);

const MockEditableCard = ({ data, handleSaveButton }) => (
  <Card className="w-full max-w-sm">
    <div className="p-4">
      <h3 className="text-lg font-semibold">Editing: {data.name}</h3>
      <Button onClick={() => handleSaveButton(data.id)}>Save</Button>
    </div>
  </Card>
);

// Override the actual components with mocks for Storybook
InHouseCards.Card = MockCard;
InHouseCards.EditableCard = MockEditableCard;