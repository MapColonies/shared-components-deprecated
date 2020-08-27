import React from "react";
import { addParameters, addDecorator } from '@storybook/react';
import { themes } from '@storybook/theming';
import { ThemeProvider, Themes } from '../src/lib/theme';
import { useDarkMode } from 'storybook-dark-mode';
import '../src/lib/rmwc/styles';

addParameters({
  docs: {
    theme: themes.dark,
  },
});

addDecorator((story) => (
  <div className="mdc-typography" style={{ padding: '24px', height: '100%' }}>
    <style>{`
    body {
      margin: 0;
    }
    
    `}</style>
    {story()}
  </div>
));

addDecorator((story) => {
  const prefersDarkMode = useDarkMode();
  const theme = prefersDarkMode ? Themes.darkTheme : Themes.lightTheme;
  return <ThemeProvider options={theme}>
      {story()}
    </ThemeProvider>
});