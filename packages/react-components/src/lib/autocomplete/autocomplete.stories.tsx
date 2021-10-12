import React from 'react';
import { action } from '@storybook/addon-actions';
import { Story } from '@storybook/react/types-6-0';
import { CSFStory } from '../utils/story';

import Autocomplete from './autocomplete';
import { TextField } from '@map-colonies/react-core';

export default {
  title: 'Autocomplete',
  component: Autocomplete,
};

export const Autocpmlete: CSFStory<JSX.Element> = () => (
  <Autocomplete {...{
    Component: <textarea />, //<TextField/>, //
    defaultValue: '',
    disabled: false,
    maxOptions: 6,
    onBlur: () => {},
    onChange: (val: string) => {},
    onKeyDown: (evt: any) => {},
    onRequestOptions: (val: string) => {},
    onSelect: (val: string) => {},
    changeOnSelect: (trigger: string, slug: string): string => `${trigger}${slug}`,
    options: ['apple', 'apricot', 'banana', 'bounty'],
    regex: '^[A-Za-z0-9\\-_]+$',
    matchAny: false,
    minChars: 0,
    requestOnlyIfNoOptions: true,
    spaceRemovers: [',', '.', '!', '?'],
    spacer: ' ',
    trigger: '@',
    offsetX: 0,
    offsetY: 0,
    value: undefined,
    passThroughEnter: false,
  }}
  />
);

Autocpmlete.story = {
  name: 'Autocpmlete',
};

// export const DateNoFutureLimitTime: CSFStory<JSX.Element> = () => (
//   <DateTimeRangePicker
//     disableFuture={false}
//     onChange={action('date changed')}
//   />
// );

// DateNoFutureLimitTime.story = {
//   name: 'Date time range no future limit',
// };

// export const DateMinMaxLimitTime: CSFStory<JSX.Element> = () => {
//   const minDate = new Date();
//   const maxDate = new Date();
//   const deltaInDays = 6;
//   minDate.setDate(maxDate.getDate() - deltaInDays);
//   maxDate.setDate(maxDate.getDate() + deltaInDays);
//   return (
//     <DateTimeRangePicker
//       onChange={action('date changed')}
//       disableFuture={false}
//       minDate={minDate}
//       maxDate={maxDate}
//     />
//   );
// };

// DateMinMaxLimitTime.story = {
//   name: 'Date time range with minDate & maxDate ',
// };

// export const DateTimeFormControl: Story = (args: unknown) => {
//   return (
//     <DateTimeRangePickerFormControl
//       {...args}
//       onChange={action('date changed')}
//     />
//   );
// };

// DateTimeFormControl.storyName = 'Date time range form control';

// DateTimeFormControl.argTypes = {
//   controlsLayout: {
//     defaultValue: 'column',
//     control: {
//       type: 'select',
//       options: ['row', 'column'],
//     },
//   },
//   local: {
//     control: {
//       type: 'object',
//     },
//   },
//   offset: {
//     defaultValue: 32,
//     control: {
//       type: 'number',
//     },
//   },
// };

// export const DateTimeLocalizedFormControl: Story = (args: unknown) => {
//   const local = {
//     setText: 'MySet',
//     startPlaceHolderText: 'MyStart',
//     endPlaceHolderText: 'MyEnd',
//   };
//   return (
//     <DateTimeRangePickerFormControl
//       local={local}
//       from={new Date(1990, 1, 1)}
//       to={new Date(1990, 1, 1)}
//       width={360}
//       {...args}
//       onChange={action('date changed')}
//     />
//   );
// };

// DateTimeLocalizedFormControl.storyName =
//   'Date time range localized form control';

// DateTimeLocalizedFormControl.argTypes = {
//   controlsLayout: {
//     defaultValue: 'column',
//     control: {
//       type: 'select',
//       options: ['row', 'column'],
//     },
//   },
//   local: {
//     control: {
//       type: 'object',
//     },
//   },
//   offset: {
//     defaultValue: 32,
//     control: {
//       type: 'number',
//     },
//   },
// };

// export const DateTimeLocalizedAsFormControl: Story = (args: unknown) => {
//   const local = {
//     setText: 'MySet',
//     startPlaceHolderText: 'MyStart',
//     endPlaceHolderText: 'MyEnd',
//   };
//   return (
//     <DateTimeRangePickerFormControl
//       local={local}
//       renderAsButton={false}
//       width={360}
//       {...args}
//       onChange={action('date changed')}
//     />
//   );
// };

// DateTimeLocalizedAsFormControl.storyName = 'Date time range looks like input';

// DateTimeLocalizedAsFormControl.argTypes = {
//   controlsLayout: {
//     defaultValue: 'column',
//     control: {
//       type: 'select',
//       options: ['row', 'column'],
//     },
//   },
//   local: {
//     control: {
//       type: 'object',
//     },
//   },
//   offset: {
//     defaultValue: 32,
//     control: {
//       type: 'number',
//     },
//   },
// };

// export const DateTimeHebrewLocalizedAsFormControl: Story = (args: unknown) => {
//   const local = {
//     setText: 'MySet',
//     startPlaceHolderText: 'MyStart',
//     endPlaceHolderText: 'MyEnd',
//     calendarLocale: SupportedLocales.HE,
//   };
//   return (
//     <DateTimeRangePickerFormControl
//       local={local}
//       renderAsButton={false}
//       width={360}
//       {...args}
//       onChange={action('date changed')}
//     />
//   );
// };

// DateTimeHebrewLocalizedAsFormControl.storyName =
//   'Date time range looks like input with Hebrew calendar';

// DateTimeHebrewLocalizedAsFormControl.argTypes = {
//   controlsLayout: {
//     defaultValue: 'column',
//     control: {
//       type: 'select',
//       options: ['row', 'column'],
//     },
//   },
//   local: {
//     control: {
//       type: 'object',
//     },
//   },
//   offset: {
//     defaultValue: 32,
//     control: {
//       type: 'number',
//     },
//   },
// };
