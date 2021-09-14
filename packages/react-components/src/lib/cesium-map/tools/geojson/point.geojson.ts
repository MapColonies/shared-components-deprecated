import { Math as CesiumMath, Cartesian3 } from 'cesium';
import { GeoJSON } from 'geojson';
import { CesiumViewer } from '../../map';

export const pointToGeoJSON = (mapViewer: CesiumViewer, x: number, y: number): GeoJSON => {
  const ellipsoid = mapViewer.scene.globe.ellipsoid;
  const cartesian = mapViewer.camera.pickEllipsoid(
    new Cartesian3(x, y),
    ellipsoid
  );
  const cartographic = ellipsoid.cartesianToCartographic(cartesian as Cartesian3);
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