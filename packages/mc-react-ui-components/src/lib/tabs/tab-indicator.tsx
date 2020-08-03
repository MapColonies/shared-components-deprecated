import * as RMWC from '../types';
import React from 'react';

import { classNames, Tag } from '../base';
import { Icon } from '../icon';
import { useTabIndicatorFoundation } from './tab-indicator-foundation';

export interface TabIndicatorProps {
  /** Use an icon instead of an underline for the tab */
  icon?: RMWC.IconPropT;
  /** The transition to use */
  transition?: 'slide' | 'fade';
}

export type TabIndicatorApi = {
  activate: (previousIndicatorClientRect?: ClientRect) => void;
  deactivate: () => void;
  computeContentClientRect: () => ClientRect;
};

export function TabIndicator(
  props: TabIndicatorProps &
    RMWC.HTMLProps & { apiRef?: (api: TabIndicatorApi | null) => void }
) {
  const { rootEl, contentEl } = useTabIndicatorFoundation(props);

  const { icon, transition } = props;

  return (
    <Tag
      tag="span"
      element={rootEl}
      className={classNames('mdc-tab-indicator', {
        'mdc-tab-indicator--fade': transition === 'fade'
      })}
    >
      <Tag
        tag={!!icon ? Icon : 'span'}
        aria-hidden="true"
        // @ts-ignore icon prop not always present, this is ok
        icon={icon}
        element={contentEl}
        className={`mdc-tab-indicator__content mdc-tab-indicator__content--${
          icon ? 'icon' : 'underline'
        }`}
      />
    </Tag>
  );
}
