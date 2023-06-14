import React, { ComponentProps } from 'react';

import { GeoJsonDataSource as ResiumGeoJsonDataSource } from 'resium';

export interface RCesiumGeojsonLayerProps extends ComponentProps<typeof ResiumGeoJsonDataSource> {}

export const CesiumGeojsonLayer: React.FC<RCesiumGeojsonLayerProps> = (
  props
) => {
  return <ResiumGeoJsonDataSource {...props} />;
};
