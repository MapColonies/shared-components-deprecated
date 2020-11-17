import { Viewer } from 'cesium';
import React from 'react';

import { Cesium3DTileset as Resium3DTileset } from 'resium';
import { Cesium3DTilesetProps } from 'resium/dist/types/src/Cesium3DTileset/Cesium3DTileset';
import { useMap } from '../map';

export interface RCesium3DTilesetProps extends Cesium3DTilesetProps {}

export const Cesium3DTileset: React.FC<RCesium3DTilesetProps> = (props) => {
  const mapViewer: Viewer = useMap();
  return (
    <Resium3DTileset
      {...props}
      onReady={(tileset): void => {
        props.onReady?.(tileset);
        void mapViewer.zoomTo(tileset);
      }}
    />
  );
};
