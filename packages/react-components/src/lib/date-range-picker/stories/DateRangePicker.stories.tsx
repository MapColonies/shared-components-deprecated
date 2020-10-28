import React from 'react';
import { action } from '@storybook/addon-actions';
import { Story, Meta } from '@storybook/react/types-6-0';
import { DateTimeRangePicker  } from '../date-range-picker';
import { DateTimeRangePickerFormControl  } from '../date-range-picker.form-control';
import { CSFStory } from '../../utils/story';

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

export const DateTimeFormControl: Story = (args: unknown) => {
  return (
    <DateTimeRangePickerFormControl 
      {...args} 
      onChange={action('date changed')} 
    />
  );
};

DateTimeFormControl.storyName = 'Date time range form control';

DateTimeFormControl.argTypes = {
  controlsLayout: {
    defaultValue: 'column',
    control: {
      type: 'select',
      options: ['row', 'column'],
    },
  },
  local: {
    control: {
      type: 'object',
    },
  }
};


export const DateTimeLocalizedFormControl: Story = (args: unknown) => {
  const local ={
    setText: 'MySet',
    startPlaceHolderText: 'MyStart',
    endPlaceHolderText: 'MyEnd',
  }
  return (
    <DateTimeRangePickerFormControl
      local={local}
      from={new Date(1990, 1, 1)}
      to={new Date(1990, 1, 1)} 
      {...args} 
      onChange={action('date changed')} 
    />
  );
};

DateTimeFormControl.storyName = 'Date time range localized form control';

DateTimeFormControl.argTypes = {
  controlsLayout: {
    defaultValue: 'column',
    control: {
      type: 'select',
      options: ['row', 'column'],
    },
  },
  local: {
    control: {
      type: 'object',
    },
  }
};
