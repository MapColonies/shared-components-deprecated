import React from 'react';

import { GeoJsonDataSource as ResiumGeoJsonDataSource } from 'resium';
import { GeoJsonDataSourceProps } from 'resium/dist/types/src/GeoJsonDataSource/GeoJsonDataSource';

export interface RCesiumGeojsonLayerProps extends GeoJsonDataSourceProps {}

export const CesiumGeojsonLayer: React.FC<RCesiumGeojsonLayerProps> = (props) => {
  return (
    <ResiumGeoJsonDataSource
      {...props}
    />
  );
};
