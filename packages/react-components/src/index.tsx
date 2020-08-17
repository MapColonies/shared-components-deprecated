import React,{ useMemo } from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { useDarkMode } from 'storybook-dark-mode';


export const ThemeWrapper:React.FC = (props) => {
  const prefersDarkMode = useDarkMode();

  const muiTheme = useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode]
  );

  return <ThemeProvider theme={muiTheme}>
      {props.children}
    </ThemeProvider>
};


ReactDOM.render(
  <React.StrictMode>
    <div>Hello world</div>
  </React.StrictMode>,
  document.getElementById('root')
);
