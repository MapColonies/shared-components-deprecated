import React from 'react';
import { Box, BoxProps } from '@material-ui/core';

export const McBox: React.FC<BoxProps> = (props: BoxProps) => {
  const { children, ...rest } = props;
  return <Box {...rest}>{children}</Box>;
};
