import React, { useState, useEffect } from 'react';
import { isValid, isBefore } from 'date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Button, ThemeProvider, createMuiTheme, useMediaQuery } from '@material-ui/core';
import { useTheme } from '@map-colonies/react-core/dist';
import { green } from '@material-ui/core/colors';
import { Box } from '../box';

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing(2),
      alignItems: 'center',
    },
    setButton: {
      marginTop: theme.spacing(1),
    },
    margin: {
      marginLeft: theme.spacing(0.5),
    },
  })
);

interface DateRangePickerProps {
  onChange: (dateRange: { from?: Date; to?: Date }) => void;
  from?: Date;
  to?: Date;
}

export const DateTimeRangePicker: React.FC<DateRangePickerProps> = (props) => {
  const classes = useStyle();
  const theme: { [key: string]: string } = useTheme();
  const [from, setFrom] = useState<Date | null>(null);
  const [to, setTo] = useState<Date | null>(null);

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  console.log('THEME OPTIONS -> ',theme);

  const theme1 = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light', 
          primary: {
            main: theme.primary,
          },
          secondary: {
            main: theme.secondary,
          },
          background: {
            paper: theme.background,
          }
    
        },
      }),
    [prefersDarkMode, theme]
  );


  useEffect(() => {    
    setFrom(props.from || null);
  }, [props.from]);

  useEffect(() => {
    setTo(props.to || null);
  }, [props.to]);

  const isRangeValid = Boolean(
    (isValid(from) && !to) ||
      (isValid(to) && !from) ||
      (from && to && isValid(from) && isValid(to) && isBefore(from, to))
  );

  const onChange = () => {
    props.onChange({
      from: from && isValid(from) ? from : undefined,
      to: to && isValid(to) ? to : undefined,
    });
  };

  return (
    <ThemeProvider theme={theme1}>
      <Box className={classes.container}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDateTimePicker
            variant="inline"
            label="from"
            onChange={(date) => setFrom(date as Date)}
            value={from}
            disableFuture={true}
          />
          <KeyboardDateTimePicker
            variant="inline"
            label="to"
            className={classes.margin}
            onChange={(date) => setTo(date as Date)}
            value={to}
            disableFuture={true}
          />
          <Button
            className={`${classes.setButton} ${classes.margin}`}
            variant="outlined"
            size="large"
            onClick={onChange}
            disabled={!isRangeValid}
          >
            set
          </Button>
        </MuiPickersUtilsProvider>
      </Box>
    </ThemeProvider>
  );
};
