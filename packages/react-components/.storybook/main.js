module.exports = {
  stories: [
    '../src/lib/date-range-picker/stories/DateRangePicker.stories.tsx',
    '../src/**/*.stories.tsx'
  ],
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-storysource',
    '@storybook/addon-actions',
    '@storybook/addon-knobs',
    '@storybook/addon-controls',
    '@storybook/addon-links',
    '@storybook/addon-docs',
    'storybook-dark-mode',
  ],
};
