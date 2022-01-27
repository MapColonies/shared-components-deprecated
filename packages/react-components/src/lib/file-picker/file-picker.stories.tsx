import React from 'react';
import { setChonkyDefaults } from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import { Story } from '@storybook/react/types-6-0';
import { FilePicker } from './file-picker';

export default {
  title: 'File Picker',
  component: FilePicker,
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
setChonkyDefaults({ iconComponent: ChonkyIconFA });

export const DarkMode: Story = () => {
  return <FilePicker darkMode={true} instanceId={'DarkMode'} />;
};
