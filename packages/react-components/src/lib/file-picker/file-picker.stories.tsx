/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useCallback, useState } from 'react';
import { Story } from '@storybook/react/types-6-0';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@material-ui/core';
import { SupportedLocales } from '../models';
import { FilePicker } from './file-picker';

export default {
  title: 'File Picker',
  component: FilePicker,
};

export const ReadOnlyMode: Story = () => <FilePicker readOnlyMode={true} />;

export const DarkTheme: Story = () => {
  return (
    <FilePicker
      theme={{
        primary: 'blue',
        background: 'black',
        textOnBackground: 'white',
        selectionBackground: '#455570',
      }}
      isDarkTheme={true}
    />
  );
};

export const Localized: Story = () => {
  const [locale, setLocale] = useState<SupportedLocales>(SupportedLocales.HE);
  const handleLocaleChange = useCallback(
    (event) => setLocale(event.target.value),
    []
  );
  return (
    <>
      <FormControl component="fieldset" style={{ marginBottom: 15 }}>
        <FormLabel component="legend">Pick a language:</FormLabel>
        <RadioGroup
          aria-label="locale"
          name="locale"
          value={locale}
          onChange={handleLocaleChange}
        >
          <FormControlLabel
            value={SupportedLocales.HE}
            control={<Radio />}
            label="עברית"
          />
          <FormControlLabel
            value={SupportedLocales.RU}
            control={<Radio />}
            label="Русский"
          />
          <FormControlLabel
            value={SupportedLocales.EN}
            control={<Radio />}
            label="English"
          />
        </RadioGroup>
      </FormControl>
      <br />
      <FilePicker locale={locale} />
    </>
  );
};
