import React from 'react';
import './App.css';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

// Import from react core components
import { ThemeProvider as RmwcThemeProvider } from '@map-colonies/react-core';
import '@map-colonies/react-core/dist/theme/styles';

import { CssBaseline } from '@material-ui/core';
import ConflictsView from './conflicts/views/conflicts-view';
import { green, red } from '@material-ui/core/colors';

const App: React.FC = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          // type: prefersDarkMode ? 'dark' : 'light', 
          type: 'dark',
          primary: {
            main: green[500],
          },
          secondary: {
            main: green[500],
            dark: green[500]
          },
          background: {
            paper: red[500],
          }

        },

      }),
    [prefersDarkMode]
  );

  return (
    <RmwcThemeProvider options={{
      
      primary: '#24aee9',
      secondary: '#e539ff',
      error: '#b00020',
      background: '#212121',
      surface: '#37474F',
      onPrimary: 'rgba(255,255,255,.87)',
      onSecondary: 'rgba(0,0,0,0.87)',
      onSurface: 'rgba(255,255,255,.87)',
      onError: '#fff',
      textPrimaryOnBackground: 'rgba(255, 255, 255, 1)',
      textSecondaryOnBackground: 'rgba(255, 255, 255, 0.7)',
      textHintOnBackground: 'rgba(255, 255, 255, 0.5)',
      textDisabledOnBackground: 'rgba(255, 255, 255, 0.5)',
      textIconOnBackground: 'rgba(255, 255, 255, 0.5)',
      textPrimaryOnLight: 'rgba(0, 0, 0, 0.87)',
      textSecondaryOnLight: 'rgba(0, 0, 0, 0.54)',
      textHintOnLight: 'rgba(0, 0, 0, 0.38)',
      textDisabledOnLight: 'rgba(0, 0, 0, 0.38)',
      textIconOnLight: 'rgba(0, 0, 0, 0.38)',
      textPrimaryOnDark: 'white',
      textSecondaryOnDark: 'rgba(255, 255, 255, 0.7)',
      textHintOnDark: 'rgba(255, 255, 255, 0.5)',
      textDisabledOnDark: 'rgba(255, 255, 255, 0.5)',
      textIconOnDark: 'rgba(255, 255, 255, 0.5)',

    }}>
      {/* <ThemeProvider theme={theme}> */}
        <CssBaseline />
        <ConflictsView />
      {/* </ThemeProvider> */}
    </RmwcThemeProvider>
  );
};

export default App;
