import React from 'react';
import { action } from '@storybook/addon-actions';
import { DateTimeRangePicker } from '../date-range-picker';

export default {
  title: 'Picker',
  component: DateTimeRangePicker,
};

export const DateTime = () => (
  <DateTimeRangePicker onChange={action('date changed')} />
);

DateTime.story = {
  name: 'Date time range',
};
