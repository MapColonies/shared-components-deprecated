import React, { useState, useEffect, useMemo } from 'react';
import { format as formatDateFns } from 'date-fns';
import { Button, TextField } from '@map-colonies/react-core';
import '@map-colonies/react-core/dist/textfield/styles';

import { SupportedLocales } from '../models/enums';
import DEFAULTS from '../models/defaults';
import { Popover } from '../popover';
import { DateTimeRangePicker } from './date-range-picker';
import './date-range-picker.form-control.css';

interface DateRangePickerProps {
  onChange: (dateRange: { from?: Date; to?: Date }) => void;
  from?: Date;
  to?: Date;
  dateFormat?: string;
  renderAsButton?: boolean;
  width?: string | number;
  controlsLayout?: 'column' | 'row';
  offset?: number;
  disableFuture?: boolean;
  maxDate?: string | number | Date | null | undefined;
  minDate?: string | number | Date | null | undefined;
  local?: {
    setText?: string;
    startPlaceHolderText?: string;
    endPlaceHolderText?: string;
    calendarLocale?: SupportedLocales;
  };
}
export const DateTimeRangePickerFormControl: React.FC<DateRangePickerProps> = (
  props
) => {
  const [from, setFrom] = useState<Date | null>(null);
  const [to, setTo] = useState<Date | null>(null);
  const [dateFormat, setDateFormat] = useState<string>(
    DEFAULTS.DATE_RANGE_PICKER.dateFormat
  );
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget);
  };
  const handleClickInput = (
    event: React.MouseEvent<HTMLInputElement>
  ): void => {
    if (event.currentTarget.tagName === 'I')
      setAnchorEl(
        event.currentTarget.previousElementSibling as HTMLButtonElement
      );
    else setAnchorEl(event.currentTarget as HTMLButtonElement);
  };
  const handleClose = (): void => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const controlsLayout = props.controlsLayout ?? 'column';

  useEffect(() => {
    setFrom(props.from ?? null);
  }, [props.from]);

  useEffect(() => {
    setTo(props.to ?? null);
  }, [props.to]);

  useEffect(() => {
    setDateFormat(props.dateFormat ?? DEFAULTS.DATE_RANGE_PICKER.dateFormat);
  }, [props.dateFormat]);

  const startPlaceHolderText =
    props.local?.startPlaceHolderText ??
    DEFAULTS.DATE_RANGE_PICKER.local.startPlaceHolderText;
  const endPlaceHolderText =
    props.local?.endPlaceHolderText ??
    DEFAULTS.DATE_RANGE_PICKER.local.endPlaceHolderText;
  const renderAsButton =
    props.renderAsButton === undefined
      ? DEFAULTS.DATE_RANGE_PICKER.renderAsButton
      : props.renderAsButton;
  const offset =
    props.offset === undefined ? DEFAULTS.DATE_RANGE_PICKER.offset : props.offset;
  const disableFuture =
    props.disableFuture === undefined
      ? DEFAULTS.DATE_RANGE_PICKER.disableFuture
      : props.disableFuture;

  const controlText = useMemo(() => {
    return `${
      from ? formatDateFns(from, dateFormat) : startPlaceHolderText
    } - ${to ? formatDateFns(to, dateFormat) : endPlaceHolderText}`;
  }, [from, to, dateFormat, startPlaceHolderText, endPlaceHolderText]);

  return (
    <>
      {renderAsButton ? (
        <Button
          style={{ width: props.width }}
          raised
          onClick={handleClick}
          className="drpOpener"
        >
          {controlText}
        </Button>
      ) : (
        <TextField
          className="drpOpener"
          readOnly
          style={{ width: props.width }}
          value={controlText}
          onClick={handleClickInput}
          trailingIcon={{
            icon: 'date_range',
            tabIndex: 0,
            onClick: handleClickInput,
          }}
        />
      )}

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        keepMounted
      >
        <DateTimeRangePicker
          controlsLayout={controlsLayout}
          contentWidth={(anchorEl?.clientWidth ?? 0) - offset}
          dateFormat={dateFormat}
          disableFuture={disableFuture}
          minDate={props.minDate}
          maxDate={props.maxDate}
          local={props.local}
          from={from ?? undefined}
          to={to ?? undefined}
          onChange={({ from, to }): void => {
            setFrom(from ?? null);
            setTo(to ?? null);
            props.onChange({ from, to });
            handleClose();
          }}
        />
      </Popover>
    </>
  );
};
