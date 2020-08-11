module.exports = {
  stories: ['./Welcome.stories.js'],
  addons: [
    '@storybook/addon-storysource',
    '@storybook/addon-actions',
    '@storybook/addon-knobs',
    '@storybook/addon-links',
    '@storybook/addon-docs',
    'storybook-dark-mode'
  ],
  refs: {
    react_components: { 
      title: "React Components", 
      url: "http://localhost:9010"
    },
    react_ui_components: { 
      title: "React UI Components", 
      url: "http://localhost:9011"
    }
  }
};