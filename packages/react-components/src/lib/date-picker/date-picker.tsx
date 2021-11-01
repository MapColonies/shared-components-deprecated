import React, { useState } from 'react';
import { he, enUS } from 'date-fns/locale';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
  KeyboardDatePicker,
  KeyboardDatePickerProps,
} from '@material-ui/pickers';
import { ParsableDate } from '@material-ui/pickers/constants/prop-types';
import { WrapperVariant } from '@material-ui/pickers/wrappers/Wrapper';
import DateFnsUtils from '@date-io/date-fns';
import { ThemeProvider } from '@material-ui/core';

import { useTheme } from '@map-colonies/react-core';
import { SupportedLocales } from '../models/enums';
import DEFAULTS from '../models/defaults';
import { useMappedMuiTheme } from '../theme';

import '@map-colonies/react-core/dist/button/styles';
import './date-picker.css';

interface DatePickerProps extends KeyboardDatePickerProps {
  local?: {
    placeHolderText?: string;
    calendarLocale?: SupportedLocales;
  };
  showTime?: boolean;
}

export const DateTimePicker: React.FC<DatePickerProps> = (props) => {
  const theme: { [key: string]: string } = useTheme();
  const themeMui = useMappedMuiTheme(theme);

  const [value, setValue] = useState<ParsableDate>(props.value);

  const {
    format = DEFAULTS.DATE_PICKER.dateFormat,
    variant = DEFAULTS.DATE_PICKER.variant,
    disableFuture = DEFAULTS.DATE_PICKER.disableFuture,
    local,
    onChange,
    showTime = DEFAULTS.DATE_PICKER.showTime,
    value: propValue,
    ...resProps
  } = props;

  const {
    placeHolderText = DEFAULTS.DATE_PICKER.local.placeHolderText,
    calendarLocale,
  } = local ?? {
    placeHolderText: DEFAULTS.DATE_PICKER.local.placeHolderText,
    calendarLocale: SupportedLocales.EN,
  };

  const locale = calendarLocale === SupportedLocales.HE ? he : enUS;

  const handleOnChange = (e: any): void => {
    setValue(e);
    onChange(e as Date);
  };

  return (
    <ThemeProvider theme={themeMui}>
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={locale}>
        {showTime && (
          <KeyboardDateTimePicker
            variant={variant as WrapperVariant}
            placeholder={placeHolderText}
            onChange={handleOnChange}
            value={value}
            disableFuture={disableFuture}
            format={format}
            {...resProps}
          />
        )}
        {!showTime && (
          <KeyboardDatePicker
            variant={variant as WrapperVariant}
            placeholder={placeHolderText}
            onChange={handleOnChange}
            value={value}
            disableFuture={disableFuture}
            format={format}
            {...resProps}
          />
        )}
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  );
};
