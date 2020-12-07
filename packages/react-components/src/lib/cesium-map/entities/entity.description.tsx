import React from 'react';

import {
  EntityDescription as ResiumEntityDescription,
  EntityStaticDescription as ResiumEntityStaticDescription,
} from 'resium';
import { EntityDescriptionProps } from 'resium/dist/types/src/EntityDescription/EntityDescription';

export interface RCesiumEntityDescriptionProps extends EntityDescriptionProps {}

export const CesiumEntityDescription: React.FC<RCesiumEntityDescriptionProps> = (
  props
) => {
  return <ResiumEntityDescription {...props} />;
};

export const CesiumEntityStaticDescription: React.FC = (props) => {
  return <ResiumEntityStaticDescription {...props} />;
};
