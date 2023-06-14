import React, { ComponentProps } from 'react';

import { PolylineGraphics as ResiumPolylineGraphics } from 'resium';

export interface RCesiumPolylineGraphicsProps extends ComponentProps<typeof ResiumPolylineGraphics> {}

export const CesiumPolylineGraphics: React.FC<RCesiumPolylineGraphicsProps> = (
  props
) => {
  return <ResiumPolylineGraphics {...props} />;
};
