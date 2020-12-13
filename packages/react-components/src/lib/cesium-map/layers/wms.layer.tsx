import React from 'react';

import { WebMapServiceImageryProvider } from 'cesium';
import { CesiumImageryLayer, RCesiumImageryLayerProps } from './imagery.layer';

export interface RCesiumWMSLayerOptions
  extends WebMapServiceImageryProvider.ConstructorOptions {}

export interface RCesiumWMSLayerProps
  extends Partial<RCesiumImageryLayerProps> {
  options: RCesiumWMSLayerOptions;
}

export const CesiumWMSLayer: React.FC<RCesiumWMSLayerProps> = (props) => {
  const { options, ...restProps } = props;
  return (
    <CesiumImageryLayer
      {...restProps}
      imageryProvider={new WebMapServiceImageryProvider(options)}
    />
  );
};
