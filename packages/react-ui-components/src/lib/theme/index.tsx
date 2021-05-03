import * as RMWC from '../types';
import React, { useMemo } from 'react';

import {
  toDashCase,
  parseThemeOptions,
  wrapChild,
  createComponent,
  Tag,
  useClassNames,
} from '../base';

import { getAutoColorsForTheme } from './utils';
import { Themes } from '../theme/themes';

/** A Theme Component. */
export interface ThemeProps {
  /** A theme option as a string, a space separated string for multiple values, or an array of valid theme options. */
  use: RMWC.ThemePropT;
  /** Collapse the styles directly onto the child component. This eliminates the need for a wrapping `span` element and may be required for applying things like background-colors.  */
  wrap?: boolean;
}

/** A Theme Component. */
export const Theme = createComponent<ThemeProps>(function Theme(props, ref) {
  const { use, wrap, ...rest } = props;

  const className = useClassNames(props, [parseThemeOptions(use).join(' ')]);

  if (wrap) {
    return wrapChild({
      ...rest,
      ref,
      className,
    });
  }

  return (
    <Tag tag="span" theme={use} {...rest} ref={ref} className={className} />
  );
});

export interface IOptions {
  [key: string]: any; // string
  custom?: { [key: string]: any };
}

/** A ThemeProvider. This sets theme colors for its child tree. */
export interface ThemeProviderProps {
  /** Any theme option pointing to a valid CSS value. */
  options: IOptions;
  /** Additional standard inline styles that will be merged into the style tag. */
  style?: Object;
  /** Instead of injecting a div tag, wrap a child component by merging the theme styles directly onto it. Useful when you don't want to mess with layout. */
  wrap?: boolean;
  /** Children to render */
  children?: React.ReactNode;
}

export const ThemeContext = React.createContext(Themes.lightTheme as IOptions);

export function useTheme() {
  const theme = React.useContext(ThemeContext);

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useDebugValue(theme);
  }

  return theme;
}

/** A ThemeProvider. This sets theme colors for its child tree. */
export const ThemeProvider = createComponent<ThemeProviderProps>(
  function ThemeProvider(props, ref) {
    const parsed = JSON.stringify(props.options);

    const colors = useMemo(() => {
      const processedColors = Object.keys(props.options).reduce(
        (acc: any, key) => {
          const val = props.options[key];
          key = key.startsWith('--') ? key : `--mdc-theme-${toDashCase(key)}`;
          acc[key] = val;
          return acc;
        },
        {}
      );

      return getAutoColorsForTheme(processedColors);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [parsed]);

    const { options, style = {}, wrap, ...rest } = props;
    const className = useClassNames(props, [
      wrap &&
        typeof rest.children === 'object' &&
        // @ts-ignore
        rest.children?.props?.className,
    ]);

    const themeStyles = {
      ...style,
      ...colors,
    } as React.CSSProperties;

    if (wrap && rest.children) {
      return wrapChild({ ...rest, style: themeStyles, ref });
    }

    return (
      <ThemeContext.Provider value={options}>
        <Tag {...rest} style={themeStyles} className={className} ref={ref} />
      </ThemeContext.Provider>
    );
  }
);

export * from './themes';
