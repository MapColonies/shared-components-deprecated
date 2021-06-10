import React from 'react';

import { PolylineGraphics as ResiumPolylineGraphics } from 'resium';
import { PolylineGraphicsProps } from 'resium/dist/types/src/PolylineGraphics/PolylineGraphics';

export interface RCesiumPolylineGraphicsProps extends PolylineGraphicsProps {}

export const CesiumPolylineGraphics: React.FC<RCesiumPolylineGraphicsProps> = (
  props
) => {
  return <ResiumPolylineGraphics {...props} />;
};
