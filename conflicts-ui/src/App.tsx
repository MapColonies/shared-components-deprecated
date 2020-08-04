import React from 'react';
import './App.css';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

// Import from react core components
import { Theme } from '@map-colonies/react-core/dist';


import { CssBaseline } from '@material-ui/core';
import ConflictsView from './conflicts/views/conflicts-view';

const App: React.FC = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      {/* <Theme use={['onPrimary']}> */}
        <CssBaseline />
        <ConflictsView />
      {/* </Theme> */}
    </ThemeProvider>
  );
};

export default App;
