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
    brandImage: '/assets/images/codebility.png',
    brandTarget: '_blank',

    colorPrimary: '#585C6D',
    colorSecondary: '#9747FF',
  })
})