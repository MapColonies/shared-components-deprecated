import { SupportedLocales } from "./enums";

const DEFAULTS = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  DATE_PICKER: {
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
  }
}

export default DEFAULTS;
