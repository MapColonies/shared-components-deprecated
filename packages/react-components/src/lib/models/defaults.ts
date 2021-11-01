import { SupportedLocales } from './enums';

const DEFAULTS = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  DATE_PICKER: {
    dateFormat: 'dd/MM/yyyy',
    local: {
      setText: 'set',
      placeHolderText: 'Enter the Date',
      calendarLocale: SupportedLocales.EN,
    },
    disableFuture: true,
    showTime: false,
    variant: 'inline',
  },
  // eslint-disable-next-line @typescript-eslint/naming-convention
  DATE_RANGE_PICKER: {
    dateFormat: 'dd/MM/yyyy HH:mm',
    controlsLayout: 'row',
    local: {
      setText: 'set',
      startPlaceHolderText: 'Start of time',
      endPlaceHolderText: 'End of time',
      calendarLocale: SupportedLocales.EN,
    },
    renderAsButton: true,
    offset: 0,
    disableFuture: true,
  },
};

export default DEFAULTS;
