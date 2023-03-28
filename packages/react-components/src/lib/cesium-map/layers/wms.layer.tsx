import React from 'react';

import { WebMapServiceImageryProvider } from 'cesium';
import { CustomWebMapServiceImageryProvider } from '../helpers/customImageryProviders';
import { useCesiumMap } from '../map';
import { ICesiumImageryLayer } from '../layers-manager';
import { CesiumImageryLayer, RCesiumImageryLayerProps } from './imagery.layer';

export interface RCesiumWMSLayerOptions
  extends WebMapServiceImageryProvider.ConstructorOptions {}

export interface RCesiumWMSLayerProps
  extends Partial<RCesiumImageryLayerProps> {
  options: RCesiumWMSLayerOptions;
}

export const CesiumWMSLayer: React.FC<RCesiumWMSLayerProps> = (props) => {
  const { options, ...restProps } = props;
  const mapViewer = useCesiumMap();

  return (
    <CesiumImageryLayer
      {...restProps}
      imageryProvider={new CustomWebMapServiceImageryProvider(options, mapViewer)}
    />
  );
};
