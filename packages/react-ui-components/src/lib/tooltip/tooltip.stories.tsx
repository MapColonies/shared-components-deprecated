import React from 'react';
import { Tooltip } from './';
import { Avatar } from '../avatar';

export default {
  title: 'Tooltips',
  component: Tooltip,
};

export const _Tooltip = () => (
  <Tooltip content="Test Tooltip">
    <a href="#" style={{ margin: '4rem', display: 'inline-block' }}>
      hover
    </a>
  </Tooltip>
);

export const TooltipWithRichContent = () => (
  <Tooltip
    content={
      <div>
        <Avatar size="xsmall" name="James Friedman" /> James Friedman
      </div>
    }
  >
    <a href="#" style={{ margin: '4rem', display: 'inline-block' }}>
      Rich Content
    </a>
  </Tooltip>
);
