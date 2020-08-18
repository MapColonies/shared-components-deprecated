import React from 'react';
import CssBaseline, { CssBaselineProps } from '@material-ui/core/CssBaseline';
import ScopedCssBaseline, {
  ScopedCssBaselineProps,
} from '@material-ui/core/ScopedCssBaseline';

export const McCssBaseline: React.FC<CssBaselineProps> = (
  props: CssBaselineProps
) => {
  const { children, ...rest } = props;
  return <CssBaseline {...rest}>{children}</CssBaseline>;
};

export const McScopedCssBaseline: React.FC<ScopedCssBaselineProps> = (
  props: ScopedCssBaselineProps
) => {
  const { children, ...rest } = props;
  return <ScopedCssBaseline {...rest}>{children}</ScopedCssBaseline>;
};
