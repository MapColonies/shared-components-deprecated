import React, { ComponentProps } from 'react';

import { RectangleGraphics as ResiumRectangleGraphics } from 'resium';

export interface RCesiumRectangleGraphicsProps extends ComponentProps<typeof ResiumRectangleGraphics> {}

export const CesiumRectangleGraphics: React.FC<RCesiumRectangleGraphicsProps> = (
  props
) => {
  return <ResiumRectangleGraphics {...props} />;
};
