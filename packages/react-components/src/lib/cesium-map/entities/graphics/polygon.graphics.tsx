import React, { ComponentProps } from 'react';

import { PolygonGraphics as ResiumPolygonGraphics } from 'resium';

export interface RCesiumPolygonGraphicsProps extends ComponentProps<typeof ResiumPolygonGraphics> {}

export const CesiumPolygonGraphics: React.FC<RCesiumPolygonGraphicsProps> = (
  props
) => {
  return <ResiumPolygonGraphics {...props} />;
};
