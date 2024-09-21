import { Meta, StoryObj } from '@storybook/react';
import InHouseCards from './in-house-cards';
import { Codev } from '@/types/home/codev';
import { mockCodev } from '@/app/home/_data/in-house-cards-data';

const meta: Meta<typeof InHouseCards> = {
  title: 'Home/InHouse/InHouseCards',
  component: InHouseCards,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof InHouseCards>;

export const Default: Story = {
  args: {
    data: [mockCodev],
    editableIds: [],
    handlers: {
      setData: () => {},
      handleEditButton: (id: string) => console.log('Edit button clicked for id:', id),
      handleSaveButton: (updatedMember: Codev) => console.log('Save button clicked for member:', updatedMember),
    },
    status: {
      LoadinginHouse: false,
      ErrorinHouse: null,
    },
    currentPage: 1,
    totalPages: 1,
    handleNextPage: () => console.log('Next page clicked'),
    handlePreviousPage: () => console.log('Previous page clicked'),
  },
};
