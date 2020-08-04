import React from "react";
import { addParameters, addDecorator } from '@storybook/react';
import { ThemeWrapper } from '../src';
import { themes } from '@storybook/theming';

addParameters({
  options: {
    theme: themes.dark,
  },
});

addDecorator((story) => <ThemeWrapper>{story()}</ThemeWrapper>);