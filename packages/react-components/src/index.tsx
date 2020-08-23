import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider, Themes } from '@map-colonies/react-core';
import { useDarkMode } from 'storybook-dark-mode';


export const ThemeWrapper:React.FC = (props) => {
  const prefersDarkMode = useDarkMode();

  const theme = prefersDarkMode ? Themes.darkTheme : Themes.lightTheme;

  return <ThemeProvider options={theme}>
      {props.children}
    </ThemeProvider>
};