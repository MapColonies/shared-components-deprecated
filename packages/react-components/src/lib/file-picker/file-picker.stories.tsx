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
import { FilePicker } from './file-picker';

export default {
  title: 'File Picker',
  component: FilePicker,
};

export const ReadOnlyMode: Story = () => <FilePicker readOnlyMode={true} />;

export const DarkTheme: Story = () => <FilePicker isDarkTheme={true} />;

export const Localized: Story = () => {
  const [locale, setLocale] = useState<string>('he');
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
          <FormControlLabel value="he" control={<Radio />} label="עברית" />
          <FormControlLabel value="ru" control={<Radio />} label="Русский" />
          <FormControlLabel value="en" control={<Radio />} label="English" />
        </RadioGroup>
      </FormControl>
      <br />
      <FilePicker locale={locale} />
    </>
  );
};
