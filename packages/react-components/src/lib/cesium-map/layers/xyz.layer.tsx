import React from 'react';

import { UrlTemplateImageryProvider } from 'cesium';
import { CesiumImageryLayer, RCesiumImageryLayerProps } from './imagery.layer';

export interface RCesiumXYZLayerOptions extends UrlTemplateImageryProvider.ConstructorOptions {};

export interface RCesiumXYZLayerProps
  extends Partial<RCesiumImageryLayerProps> {
  options: UrlTemplateImageryProvider.ConstructorOptions;
}

export const CesiumXYZLayer: React.FC<RCesiumXYZLayerProps> = (props) => {
  const { options, ...restProps } = props;
  return (
    <CesiumImageryLayer
      {...restProps}
      imageryProvider={new UrlTemplateImageryProvider(options)}
    />
  );
};
