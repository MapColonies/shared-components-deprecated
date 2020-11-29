import React from 'react';

import { CustomDataSource  as ResiumCustomDataSource } from 'resium';
import { CustomDataSourceProps } from 'resium/dist/types/src/CustomDataSource/CustomDataSource';

export interface RCesiumCustomDataSourceProps extends CustomDataSourceProps {}

export const CesiumCustomDataSource: React.FC<RCesiumCustomDataSourceProps> = (
  props
) => {
  return <ResiumCustomDataSource {...props} />;
};
