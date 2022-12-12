import { Math as CesiumMath, Cartesian3, Cartographic } from 'cesium';
import { GeoJSON } from 'geojson';
import { CesiumViewer } from '../../map';

const pointToCartographic = (
  mapViewer: CesiumViewer,
  x: number,
  y: number
): Cartographic => {
  const ellipsoid = mapViewer.scene.globe.ellipsoid;
  const cartesian = mapViewer.camera.pickEllipsoid(
    new Cartesian3(x, y),
    ellipsoid
  );
  const cartographic = ellipsoid.cartesianToCartographic(
    cartesian as Cartesian3
  );

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
