import React from "react";
import { addParameters } from '@storybook/react';
import { themes } from '@storybook/theming';

addParameters({
  docs: {
    theme: themes.dark,
  },
});