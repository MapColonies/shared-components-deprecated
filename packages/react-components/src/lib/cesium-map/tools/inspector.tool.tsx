import React, { useEffect } from 'react';
import { viewerCesiumInspectorMixin } from 'cesium';
import { CesiumViewer, useCesiumMap } from '../map';

export interface InspectorProps {}

export const InspectorTool: React.FC<InspectorProps> = (props) => {
  const mapViewer: CesiumViewer = useCesiumMap();

  useEffect(() => {
    mapViewer.extend(viewerCesiumInspectorMixin);
  }, [mapViewer]);

  return <></>;
};
