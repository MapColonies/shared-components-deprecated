import React from 'react';

import { PolygonGraphics  as ResiumPolygonGraphics} from 'resium';
import { PolygonGraphicsProps } from 'resium/dist/types/src/PolygonGraphics/PolygonGraphics';

export interface RCesiumPolygonGraphicsProps extends PolygonGraphicsProps {}

export const CesiumPolygonGraphics: React.FC<RCesiumPolygonGraphicsProps> = (
  props
) => {
  return <ResiumPolygonGraphics {...props} />;
};
