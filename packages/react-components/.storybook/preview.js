import React from "react";
import { addParameters, addDecorator } from '@storybook/react';
import { ThemeProvider, Themes } from '@map-colonies/react-core';
import { themes } from '@storybook/theming';
import { useDarkMode } from 'storybook-dark-mode';
import '@map-colonies/react-core/dist/rmwc/styles';

addParameters({
  docs: {
    theme: themes.dark,
  },
});

addDecorator((story) => {
  const prefersDarkMode = useDarkMode();
  const theme = prefersDarkMode ? Themes.darkTheme : Themes.lightTheme;
  return <ThemeProvider options={theme}>
      {story()}
    </ThemeProvider>
});