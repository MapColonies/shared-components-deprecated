import React, { useState, useEffect } from 'react';
import { isValid, isBefore } from 'date-fns';
import { he, enUS } from 'date-fns/locale';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core';

import { Button, useTheme } from '@map-colonies/react-core';
import '@map-colonies/react-core/dist/button/styles';
import { ThemeProvider as RmwcThemeProvider } from '@map-colonies/react-core';
import { SupportedLocales } from '../models/enums';
import DEFAULTS from '../models/defaults';
import { Box } from '../box';
import { useMappedMuiTheme } from '../theme';
import './date-range-picker.css';

const CONTAINER_SPACING_FACTOR = 2;
const MARGIN_LEFT_FACTOR = 0.5;

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing(CONTAINER_SPACING_FACTOR),
      alignItems: 'center',
    },
    setButton: {
      marginTop: theme.spacing(1),
    },
    margin: {
      marginLeft: theme.spacing(MARGIN_LEFT_FACTOR),
    },
  })
);

interface DateRangePickerProps {
  onChange: (dateRange: { from?: Date; to?: Date }) => void;
  from?: Date;
  to?: Date;
  dateFormat?: string;
  controlsLayout?: string;
  contentWidth?: number;
  disableFuture?: boolean;
  maxDate?: string | number | Date | null | undefined,
  minDate?: string | number | Date | null | undefined,
  local?:{
    setText?: string,
    startPlaceHolderText?: string,
    endPlaceHolderText?: string,
    calendarLocale?: SupportedLocales;
  }
}

export const DateTimeRangePicker: React.FC<DateRangePickerProps> = (props) => {
  const classes = useStyle();
  const theme: { [key: string]: string } = useTheme();
  const themeMui = useMappedMuiTheme(theme);
  const [from, setFrom] = useState<Date | null>(null);
  const [to, setTo] = useState<Date | null>(null);
  const [dateFormat, setDateFormat] = useState<string>(DEFAULTS.DATE_PICKER.dateFormat);

  const flexDirection = props.controlsLayout ?? DEFAULTS.DATE_PICKER.controlsLayout;
  const disableFuture = props.disableFuture ?? DEFAULTS.DATE_PICKER.disableFuture;
  const startPlaceHolderText = props.local?.startPlaceHolderText ?? DEFAULTS.DATE_PICKER.local.startPlaceHolderText;
  const endPlaceHolderText = props.local?.endPlaceHolderText ?? DEFAULTS.DATE_PICKER.local.endPlaceHolderText;
  const setText = props.local?.setText ?? DEFAULTS.DATE_PICKER.local.setText;
  const calendarLocale = props.local?.calendarLocale ?? DEFAULTS.DATE_PICKER.local.calendarLocale;
    
  const locale = (calendarLocale === SupportedLocales.HE) ? he : enUS;

  useEffect(() => {
    setFrom(props.from ?? null);
  }, [props.from]);

  useEffect(() => {
    setTo(props.to ?? null);
  }, [props.to]);

  useEffect(() => {
    setDateFormat(props.dateFormat ?? DEFAULTS.DATE_PICKER.dateFormat);
  }, [props.dateFormat]);

  const isRangeValid = Boolean(
    (isValid(from) && !to) ||
      (isValid(to) && !from) ||
      (from && to && isValid(from) && isValid(to) && isBefore(from, to))
  );

  const onChange = (): void => {
    props.onChange({
      from: from && isValid(from) ? from : undefined,
      to: to && isValid(to) ? to : undefined,
    });
  };

  return (
    <ThemeProvider theme={themeMui}>
      <Box className={`${classes.container} drpContainer`} display="flex" flexDirection={flexDirection} width={flexDirection === 'column' ? props.contentWidth : 'unset'}>
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={locale}>
          <KeyboardDateTimePicker
            variant="inline"
            label={startPlaceHolderText}
            onChange={(date): void => setFrom(date as Date)}
            value={from}
            disableFuture={disableFuture}
            format={dateFormat}
            maxDate={props.maxDate}
            minDate={props.minDate}
          />
          <KeyboardDateTimePicker
            variant="inline"
            label={endPlaceHolderText}
            className={classes.margin}
            onChange={(date): void => setTo(date as Date)}
            value={to}
            disableFuture={disableFuture}
            format={dateFormat}
            maxDate={props.maxDate}
            minDate={props.minDate}
          />
          <RmwcThemeProvider options={theme}>
            <Button
              className={`${classes.setButton} ${classes.margin}`}
              raised
              // variant="outlined"
              // size="large"
              onClick={onChange}
              disabled={!isRangeValid}
            >
              {setText}
            </Button>
          </RmwcThemeProvider>
        </MuiPickersUtilsProvider>
      </Box>
    </ThemeProvider>
  );
};
