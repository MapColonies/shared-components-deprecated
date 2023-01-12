import {
  Math as CesiumMath,
  Cartesian3,
  Cartographic,
  SceneMode,
  Cartesian2,
} from 'cesium';
import { GeoJSON } from 'geojson';
import { CesiumViewer } from '../../map';

const pointToCartographic = (
  mapViewer: CesiumViewer,
  x: number,
  y: number
): Cartographic => {
  let cartesian;

  if (mapViewer.scene.mode !== SceneMode.SCENE2D) {
    cartesian = mapViewer.scene.pickPosition(new Cartesian2(x, y));
  } else {
    const ellipsoid = mapViewer.scene.globe.ellipsoid;
    cartesian = mapViewer.camera.pickEllipsoid(new Cartesian2(x, y), ellipsoid);
  }

  return Cartographic.fromCartesian(cartesian as Cartesian3);
};

export const pointToGeoJSON = (
  mapViewer: CesiumViewer,
  x: number,
  y: number
): GeoJSON => {
  const cartographic = pointToCartographic(mapViewer, x, y);

  return {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Point',
      coordinates: [
        CesiumMath.toDegrees(cartographic.longitude),
        CesiumMath.toDegrees(cartographic.latitude),
      ],
    },
  };
};

export const pointToLonLat = (
  mapViewer: CesiumViewer,
  x: number,
  y: number
): { longitude: number; latitude: number } | undefined => {
  try {
    const cartographic = pointToCartographic(mapViewer, x, y);

    return {
      longitude: CesiumMath.toDegrees(cartographic.longitude),
      latitude: CesiumMath.toDegrees(cartographic.latitude),
    };
  } catch (e) {
    return undefined;
  }
};
