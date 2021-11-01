import React from 'react';
import { action } from '@storybook/addon-actions';
import { Story } from '@storybook/react/types-6-0';
import { CSFStory } from '../utils/story';
import { SupportedLocales } from '../models/enums';
import { DateTimePicker } from './date-picker';

const TODAY = new Date();

export default {
  title: 'Date Picker',
  component: DateTimePicker,
};

export const DatePickerDefault: CSFStory<JSX.Element> = () => (
  <DateTimePicker onChange={action('date changed')} value={TODAY} />
);

DatePickerDefault.story = {
  name: 'Date picker default',
};

export const DateTimePickerMode: CSFStory<JSX.Element> = () => (
  <DateTimePicker
    value={TODAY}
    onChange={action('date changed')}
    showTime={true}
    format={'dd/MM/yyyy HH:mm'}
  />
);

DateTimePickerMode.story = {
  name: 'Date time picker',
};

export const DateNoFutureLimitTime: CSFStory<JSX.Element> = () => (
  <DateTimePicker
    value={TODAY}
    disableFuture={false}
    onChange={action('date changed')}
  />
);

DateNoFutureLimitTime.story = {
  name: 'Date time no future limit',
};

export const DateMinMaxLimitTime: CSFStory<JSX.Element> = () => {
  const minDate = new Date();
  const maxDate = new Date();
  const deltaInDays = 6;
  minDate.setDate(maxDate.getDate() - deltaInDays);
  maxDate.setDate(maxDate.getDate() + deltaInDays);
  return (
    <DateTimePicker
      value={TODAY}
      onChange={(date) => {
        action('date changed')(date);
        console.log(date?.toDateString());
      }}
      minDate={minDate}
      maxDate={maxDate}
    />
  );
};

DateMinMaxLimitTime.story = {
  name: 'Date time with minDate & maxDate ',
};

export const DateMinMaxLimitTimeWithOnBlur: CSFStory<JSX.Element> = () => {
  const minDate = new Date();
  const maxDate = new Date();
  const deltaInDays = 6;
  minDate.setDate(maxDate.getDate() - deltaInDays);
  maxDate.setDate(maxDate.getDate() + deltaInDays);
  return (
    <DateTimePicker
      value={TODAY}
      onChange={(date) => {
        action('date changed')(date);
        console.log(date?.toDateString());
      }}
      onBlur={(date) => {
        action('OnBlur invoked')(date);
        console.log('OnBlur invoked');
      }}
      minDate={minDate}
      maxDate={maxDate}
    />
  );
};

DateMinMaxLimitTimeWithOnBlur.story = {
  name: 'Date time with OnBlur ',
};

export const DateTimeWithControlArgs: Story = (args: unknown) => {
  return (
    <DateTimePicker {...args} value={TODAY} onChange={action('date changed')} />
  );
};

DateTimeWithControlArgs.storyName = 'Date time control with args';

DateTimeWithControlArgs.argTypes = {
  local: {
    control: {
      type: 'object',
    },
  },
};

export const DateTimeHebrewLocalized: Story = (args: unknown) => {
  const local = {
    placeHolderText: 'הכנס תאריך',
    calendarLocale: SupportedLocales.HE,
  };
  return (
    <DateTimePicker
      local={local}
      {...args}
      value={TODAY}
      onChange={action('date changed')}
    />
  );
};

DateTimeHebrewLocalized.storyName =
  'Date time range looks like input with Hebrew calendar';
