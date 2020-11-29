import React from 'react';

import { RectangleGraphics  as ResiumRectangleGraphics} from 'resium';
import { RectangleGraphicsProps } from 'resium/dist/types/src/RectangleGraphics/RectangleGraphics';

export interface RCesiumRectangleGraphicsProps extends RectangleGraphicsProps {}

export const CesiumRectangleGraphics: React.FC<RCesiumRectangleGraphicsProps> = (
  props
) => {
  return <ResiumRectangleGraphics {...props} />;
};
