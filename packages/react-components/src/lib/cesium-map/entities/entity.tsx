import React, { ComponentProps } from 'react';

import { Entity as ResiumEntity } from 'resium';


export interface RCesiumEntityProps extends ComponentProps<typeof ResiumEntity> {}

export const CesiumEntity: React.FC<RCesiumEntityProps> = (props) => {
  return <ResiumEntity {...props} />;
};
