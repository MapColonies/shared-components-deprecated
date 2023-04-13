import React from 'react';

import { WebMapTileServiceImageryProvider } from 'cesium';
import { CustomWebMapTileServiceImageryProvider } from '../helpers/customImageryProviders';
import { useCesiumMap } from '../map';
import { CesiumImageryLayer, RCesiumImageryLayerProps } from './imagery.layer';

export interface RCesiumWMTSLayerOptions
  extends WebMapTileServiceImageryProvider.ConstructorOptions {}

export interface RCesiumWMTSLayerProps
  extends Partial<RCesiumImageryLayerProps> {
  options: RCesiumWMTSLayerOptions;
}

export const CesiumWMTSLayer: React.FC<RCesiumWMTSLayerProps> = (props) => {
  const { options, ...restProps } = props;
  const mapViewer = useCesiumMap();

  const providerInstance = mapViewer.shouldOptimizedTileRequests
    ? new CustomWebMapTileServiceImageryProvider(options, mapViewer)
    : new WebMapTileServiceImageryProvider(options);

  return (
    <CesiumImageryLayer {...restProps} imageryProvider={providerInstance} />
  );
};
