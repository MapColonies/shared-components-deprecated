import React from 'react';

import { UrlTemplateImageryProvider } from 'cesium';
import { CustomUrlTemplateImageryProvider } from '../helpers/customImageryProviders';
import { useCesiumMap } from '../map';
import { ICesiumImageryLayer } from '../layers-manager';
import { CesiumImageryLayer, RCesiumImageryLayerProps } from './imagery.layer';

export interface RCesiumXYZLayerOptions
  extends UrlTemplateImageryProvider.ConstructorOptions {}

export interface RCesiumXYZLayerProps
  extends Partial<RCesiumImageryLayerProps> {
  options: UrlTemplateImageryProvider.ConstructorOptions;
}

export const CesiumXYZLayer: React.FC<RCesiumXYZLayerProps> = (props) => {
  const { options, ...restProps } = props;
  const mapViewer = useCesiumMap();
  return (
    <CesiumImageryLayer
      {...restProps}
      imageryProvider={new CustomUrlTemplateImageryProvider(options, mapViewer)}
    />
  );
};
