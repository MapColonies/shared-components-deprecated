import React from 'react';

import { ImageryLayer as ResiumImageryLayer } from 'resium';
import { ImageryLayerProps } from 'resium/dist/types/src/ImageryLayer/ImageryLayer';

export interface RCesiumImageryLayerProps extends ImageryLayerProps {}

export const CesiumImageryLayer: React.FC<RCesiumImageryLayerProps> = (
  props
) => {
  return <ResiumImageryLayer {...props} />;
};
