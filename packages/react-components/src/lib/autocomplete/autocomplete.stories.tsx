/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/prefer-regexp-exec, @typescript-eslint/no-magic-numbers*/
import React from 'react';
import { Story } from '@storybook/react/types-6-0';
import { TextField } from '@map-colonies/react-core';
import { CSFStory } from '../utils/story';

import Autocomplete from './autocomplete';

export default {
  title: 'Autocomplete',
  component: Autocomplete,
};

export const AutocpmleteTextArea: CSFStory<JSX.Element> = () => (
  <>
    <h1>Autocpmlete with native HTML TEXTAREA</h1>
    <Autocomplete
      {...{
        options: ['apple', 'apricot', 'banana', 'bounty'],
      }}
    />
  </>
);
AutocpmleteTextArea.story = {
  name: 'Autocpmlete with TEXTAREA HTML',
};

export const AutocpmleteTextField: Story = (args: unknown) => {
  return (
    <>
      <h1>Autocpmlete with TEXTFIELD react-core component</h1>
      <Autocomplete
        {...{
          Component: <TextField />,
          ComponentProps: {
            name: 'autocomplete',
          },
          options: ['apple', 'apricot', 'banana', 'bounty'],
        }}
        {...args}
      />
    </>
  );
};
AutocpmleteTextField.storyName = 'Autocpmlete with TEXTFIELD component';
AutocpmleteTextField.argTypes = {
  disabled: {
    defaultValue: false,
    control: {
      type: 'boolean',
    },
  },
  trigger: {
    defaultValue: '@',
    control: {
      type: 'text',
    },
  },
  spacer: {
    defaultValue: ' ',
    control: {
      type: 'text',
    },
  },
};

export const AutocpmleteInComplitionModeEN: Story = (args: unknown) => {
  return (
    <>
      <h1>Autocpmlete with TEXTFIELD in AUTOCOMPLETE mode in English (LTR)</h1>
      <Autocomplete
        {...{
          Component: <TextField />,
          mode: 'autocomplete',
          options: ['apple', 'apricot', 'banana', 'bounty'],
        }}
        {...args}
      />
    </>
  );
};
AutocpmleteInComplitionModeEN.storyName =
  'Autocpmlete in autocomplete MODE RTL';

export const AutocpmleteInComplitionModeHEB: Story = (args: unknown) => {
  return (
    <div style={{ direction: 'rtl' }}>
      <h1>Autocpmlete with TEXTFIELD in AUTOCOMPLETE mode in Hebrew (RTL)</h1>
      <Autocomplete
        {...{
          Component: <TextField />,
          mode: 'autocomplete',
          options: ['אגוזאגוז', 'תפוח', 'אפרסק', 'בננה', 'אגוז'],
        }}
        {...args}
      />
    </div>
  );
};
AutocpmleteInComplitionModeHEB.storyName =
  'Autocpmlete in autocomplete MODE LTR';
