import React from 'react';
import { boolean } from '@storybook/addon-knobs';
import { Ripple } from './';

const rippleStyle = {
  width: '240px',
  height: '240px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export default {
  title: 'Ripples',
  component: Ripple
};

export const _Ripple = () => (
  <Ripple
    style={rippleStyle}
    primary={boolean('primary', false)}
    accent={boolean('accent', false)}
    unbounded={boolean('unbounded', false)}
    foundationRef={console.log}
  >
    <div style={rippleStyle}>Click Me</div>
  </Ripple>
);
