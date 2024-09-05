import type { Preview } from "@storybook/react";

const preview: Preview = {
  parameters: {
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
};

export default preview;
