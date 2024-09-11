import type { Preview } from '@storybook/react'
import '../app/globals.css'
import { INITIAL_VIEWPORTS, MINIMAL_VIEWPORTS } from '@storybook/addon-viewport'

const CUSTOM_VIEWPORTS = {
  FHD: {
    name: "FHD - 1080px",
    styles: {
      width: "1920px",
      height: "1080px",
    },
  }
}

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#F5F5F5',
        },
        {
          name: 'gray',
          value: '#5F5F5F',
        },
        {
          name: 'dark',
          value: '#131313',
        },
      ]
    },
    nextjs: {
      appDirectory: true,
    },
    controls: {
      expanded: true, //this will expand the content of the control section
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      viewports: {
        ...MINIMAL_VIEWPORTS, //base 3 viewport choices
        ...CUSTOM_VIEWPORTS,  //custom viewports that was created
        ...INITIAL_VIEWPORTS, //default browser viewport choices
      },
      //defaultViewport: 'tablet',  //use this to choose a default viewport
    }
  },
  // tags: ["autodocs"]
}

export default preview
