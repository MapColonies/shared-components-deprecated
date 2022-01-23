module.exports = {
  stories: [
    '../src/**/*.stories.tsx',
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
