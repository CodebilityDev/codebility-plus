import { Meta, StoryObj } from '@storybook/react';

import { strategy_data } from './strategy_data'
import { TradingStrategiesTable } from './strategy-table';

const meta: Meta<typeof TradingStrategiesTable> = {
  component: TradingStrategiesTable,
  tags: ['autodocs'],
};
export default meta;
export const Default: StoryObj<typeof TradingStrategiesTable> = {
  args: {
    data: strategy_data,
  },
};
