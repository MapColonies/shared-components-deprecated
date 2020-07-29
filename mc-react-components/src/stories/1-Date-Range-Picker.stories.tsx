import React from 'react';
import { DateTimeRangePicker } from '../lib/date-range-picker';

export default {
  title: 'Range Picker',
  component: DateTimeRangePicker,
};

export const DateTime = () => <DateTimeRangePicker onChange={() => null}></DateTimeRangePicker>;

DateTime.story = {
    name: 'Date time',
};

