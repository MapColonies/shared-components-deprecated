import React, { ComponentProps } from 'react';

import { CustomDataSource as ResiumCustomDataSource } from 'resium';


export interface RCesiumCustomDataSourceProps extends ComponentProps<typeof ResiumCustomDataSource> {}

export const CesiumCustomDataSource: React.FC = (
  props
) => {
  return <ResiumCustomDataSource {...props} />;
};
