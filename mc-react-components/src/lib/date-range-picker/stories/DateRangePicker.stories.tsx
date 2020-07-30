import React from 'react';
import { DateTimeRangePicker } from '../date-range-picker';

export default {
  title: 'Range Picker',
  component: DateTimeRangePicker,
};

export const DateTime = () => <DateTimeRangePicker onChange={() => null}/>;

DateTime.story = {
    name: 'Date time',
};