import React from 'react';

import { OpenStreetMapImageryProvider } from 'cesium';
import { CesiumImageryLayer, RCesiumImageryLayerProps } from './imagery.layer';

export interface RCesiumOSMLayerOptions
  extends OpenStreetMapImageryProvider.ConstructorOptions {}

export interface RCesiumOSMLayerProps
  extends Partial<RCesiumImageryLayerProps> {
  options: RCesiumOSMLayerOptions;
}

export const CesiumOSMLayer: React.FC<RCesiumOSMLayerProps> = (props) => {
  const { options, ...restProps } = props;
  return (
    <CesiumImageryLayer
      {...restProps}
      imageryProvider={new OpenStreetMapImageryProvider(options)}
    />
  );
};
