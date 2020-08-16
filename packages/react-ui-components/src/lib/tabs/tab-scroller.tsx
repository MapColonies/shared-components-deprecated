import * as RMWC from '../types';
import React from 'react';

import { Tag } from '../base';
import { useTabScrollerFoundation } from './tab-scroller-foundation';

export interface TabScrollerProps {
  apiRef: (api: TabScrollerApi) => void;
}

export type TabScrollerApi = {
  scrollTo: (scrollX: number) => void;
  incrementScroll: (scrollXIncrement: number) => void;
  getScrollPosition: () => number;
  getScrollContentWidth: () => number;
};

export function TabScroller(props: TabScrollerProps & RMWC.HTMLProps) {
  const { children, apiRef, ...rest } = props;
  const { rootEl, areaEl, contentEl } = useTabScrollerFoundation(props);
  return (
    <Tag {...rest} ref={null} element={rootEl} className="mdc-tab-scroller">
      <Tag element={areaEl} className="mdc-tab-scroller__scroll-area">
        <Tag element={contentEl} className="mdc-tab-scroller__scroll-content">
          {children}
        </Tag>
      </Tag>
    </Tag>
  );
}
