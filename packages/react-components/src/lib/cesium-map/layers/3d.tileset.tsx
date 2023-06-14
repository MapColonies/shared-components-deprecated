import React, { ComponentProps } from 'react';
import { Cartesian3, Cartographic, Matrix4 } from 'cesium';
import { Cesium3DTileset as Resium3DTileset } from 'resium';
import { CesiumViewer, useCesiumMap } from '../map';

const GROUND_LEVEL = 0.0;

export interface RCesium3DTilesetProps extends ComponentProps<typeof Resium3DTileset> {
  isZoomTo?: boolean;
  heightFromGround?: number;
}

export const Cesium3DTileset: React.FC<RCesium3DTilesetProps> = (props) => {
  const mapViewer: CesiumViewer = useCesiumMap();
  return (
    <Resium3DTileset
      {...props}
      onReady={(tileset): void => {
        // props.onReady?.(tileset);

        if (props.isZoomTo === true) {
          void mapViewer.zoomTo(tileset);
        }
        const scene = mapViewer.scene;
        scene.globe.depthTestAgainstTerrain = true;
        const cartographic = Cartographic.fromCartesian(
          tileset.boundingSphere.center
        );
        const heightFromGround = props.heightFromGround ?? GROUND_LEVEL;
        if (heightFromGround) {
          const surface = Cartesian3.fromRadians(
            cartographic.longitude,
            cartographic.latitude,
            cartographic.height
          );
          const offset = Cartesian3.fromRadians(
            cartographic.longitude,
            cartographic.latitude,
            cartographic.height + heightFromGround
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
