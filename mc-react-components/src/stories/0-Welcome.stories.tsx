import React from 'react';
import { Welcome } from '@storybook/react/demo';

export default {
  title: 'Welcome',
  component: Welcome,
};

export const ToStorybook = () => {
  return (<div>
    <h1>Welcome to Shared Components</h1><br />
    <h4>A React monorepo for Map Colonies Organization.</h4>
  </div>
  )
};

ToStorybook.story = {
  name: 'to Shared Components',
};
