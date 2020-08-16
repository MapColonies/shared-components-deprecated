/**
 * @jest-environment node
 */

import React from 'react';
import { renderToString as mount } from 'react-dom/server';
import { RMWCProvider } from './';

describe('Provider SSR', () => {
  it('renders', () => {
    const el = mount(
      <RMWCProvider>
        <div />
      </RMWCProvider>
    );
  });
});
