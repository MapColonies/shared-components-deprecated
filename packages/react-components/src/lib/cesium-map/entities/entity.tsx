import React from 'react';

import { Entity as ResiumEntity } from 'resium';
import { EntityProps } from 'resium/dist/types/src/Entity/Entity';

export interface RCesiumEntityProps extends EntityProps {}

export const CesiumEntity: React.FC<RCesiumEntityProps> = (props) => {
  return <ResiumEntity {...props} />;
};
