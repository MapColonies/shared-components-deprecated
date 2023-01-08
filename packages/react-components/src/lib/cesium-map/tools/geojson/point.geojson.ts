import { Math as CesiumMath, Cartesian3, Cartographic } from 'cesium';
import Cartesian2 from 'cesium/Source/Core/Cartesian2';
import { GeoJSON } from 'geojson';
import { CesiumViewer } from '../../map';

const pointToCartographic = (
  mapViewer: CesiumViewer,
  x: number,
  y: number
): Cartographic => {
  // TODO: Handle 2D Mode, works only for 3D
  const cartesian = mapViewer.scene.pickPosition(new Cartesian2(x, y));
  const cartographic = Cartographic.fromCartesian(cartesian);

  return cartographic;
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
): { longitude: number, latitude: number } => {
  const cartographic = pointToCartographic(mapViewer, x, y);

  return { longitude: CesiumMath.toDegrees(cartographic.longitude), latitude: CesiumMath.toDegrees(cartographic.latitude) };
};
