import React from 'react'
import { Decorator } from '@storybook/react'

export const withMaxWidth: Decorator = (Story) => {
  return <div
  style={{
    // maxWidth: '1280px',
    margin: '0 auto',
    border: '1px solid black',
  }}>
    <Story />
  </div>
};

export const decorators = [withMaxWidth];

