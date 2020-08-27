import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';
import { Button } from './';
import { Fab } from '../fab';

export default {
  title: "Buttons",
  component: Button,
  subcomponents: { Fab }
};

export const button = () => (
  <Button
    unelevated={boolean('unelevated', false)}
    outlined={boolean('outlined', false)}
    dense={boolean('dense', false)}
    raised={boolean('raised', false)}
    ripple={boolean('ripple', true)}
    onClick={action('onClick')}
    className="test"
  >
    Button
  </Button>
);
