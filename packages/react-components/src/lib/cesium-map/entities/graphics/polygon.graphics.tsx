import React from 'react';

import { PolygonGraphics  as ResiumPolygonGraphics} from 'resium';
import { PolygonGraphicsProps } from 'resium/dist/types/src/PolygonGraphics/PolygonGraphics';

export interface RCesiumPolygonGraphicsPropss extends PolygonGraphicsProps {}

export const CesiumPolygonGraphics: React.FC<RCesiumPolygonGraphicsPropss> = (
  props
) => {
  return <ResiumPolygonGraphics {...props} />;
};
