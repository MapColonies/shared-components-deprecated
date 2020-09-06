import React from 'react';
import { action } from '@storybook/addon-actions';
import { DateTimeRangePicker } from '../date-range-picker';
import { CSFStory } from '../../../utils/story';

export default {
  title: 'Picker',
  component: DateTimeRangePicker,
};

export const DateTime: CSFStory<JSX.Element> = () => (
  <DateTimeRangePicker onChange={action('date changed')} />
);

DateTime.story = {
  name: 'Date time range',
};
