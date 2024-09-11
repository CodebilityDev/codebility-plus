import { addons } from '@storybook/manager-api'
import { create } from '@storybook/theming'

addons.setConfig({
  theme: create({
    base: 'dark',

    //Typography
    fontBase: '"Open Sans", sans-serif',
    fontCode: 'monospace',

    //Logo section
    brandTitle: 'Codebility',
    brandUrl: 'https://staging.codebility.tech/',
    brandImage: '/assets/images/codebility.jpg',
    brandTarget: '_blank',

    colorPrimary: '#F5F5F5',
    colorSecondary: '#9747FF',

    // UI
    appBg: '#000000',
    appContentBg: '#232323',
    appPreviewBg: '#F5F5F5',
    appBorderColor: '#F5F5F5',
    appBorderRadius: 4,

    // Form colors
    inputBg: '#F5F5F5',
    inputBorder: '#000000',
    inputTextColor: '#000000',
    inputBorderRadius: 2,
  })
})