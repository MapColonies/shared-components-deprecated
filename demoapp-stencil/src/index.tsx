import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { App } from './app';
import './index.css';

import { applyPolyfills, defineCustomElements } from '@map-colonies/ui-components/loader';

ReactDOM.render(<App />, document.getElementById('root'));

applyPolyfills().then(() => {
    defineCustomElements();
  });
