import React, { PropsWithChildren } from 'react';

import {EntityDescription as ResiumEntityDescription} from 'resium';

export interface RCesiumEntityDescriptionProps extends PropsWithChildren<{
  container?: Element;
  resizeInfoBox?: boolean;
}> {}

export const CesiumEntityDescription: React.FC<RCesiumEntityDescriptionProps> = (
  props
) => {
  return <ResiumEntityDescription {...props} />;
};

export const CesiumEntityStaticDescription: React.FC = (props) => {
  return <ResiumEntityDescription {...props} />;
};
