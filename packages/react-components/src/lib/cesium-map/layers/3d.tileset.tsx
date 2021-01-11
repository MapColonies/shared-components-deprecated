import { Cartesian3, Cartographic, Matrix4, Viewer } from 'cesium';
import React from 'react';

import { Cesium3DTileset as Resium3DTileset } from 'resium';
import { Cesium3DTilesetProps } from 'resium/dist/types/src/Cesium3DTileset/Cesium3DTileset';
import { useCesiumMap } from '../map';

export interface RCesium3DTilesetProps extends Cesium3DTilesetProps {
  isZoomTo?: boolean;
  heightFromGround?: number;
}

export const Cesium3DTileset: React.FC<RCesium3DTilesetProps> = (props) => {
  const mapViewer: Viewer = useCesiumMap();
  return (
    <Resium3DTileset
      {...props}
      onReady={(tileset): void => {
        props.onReady?.(tileset);
        if (props.isZoomTo) {
          void mapViewer.zoomTo(tileset);
        }
        if (props.heightFromGround) {
          const cartographic = Cartographic.fromCartesian(
            tileset.boundingSphere.center
          );
          const surface = Cartesian3.fromRadians(
            cartographic.longitude,
            cartographic.latitude,
            0.0
          );
          const offset = Cartesian3.fromRadians(
            cartographic.longitude,
            cartographic.latitude,
            props.heightFromGround
          );
          const translation = Cartesian3.subtract(
            offset,
            surface,
            new Cartesian3()
          );
          tileset.modelMatrix = Matrix4.fromTranslation(translation);
        }
      }}
    />
  );
};
