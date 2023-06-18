module.exports = {
  stories: ['../src/**/*.stories.tsx'],
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-storysource',
    '@storybook/addon-actions',
    '@storybook/addon-knobs',
    '@storybook/addon-docs',
    '@storybook/addon-controls',
    '@storybook/addon-links',
    'storybook-dark-mode',
  ],
  webpackFinal: async (config) => {
    const rules = config.module.rules;
    const extensions = config.resolve.extensions;

    rules.push({
      test: /(\.mjs|\.js|\.jsx|\.ts|\.tsx)$/,
      // exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
        },
      },
    });
    // extensions.push('.ts','.js','.jsx')

    return config;
  },
};
