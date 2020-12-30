import { Math as CesiumMath, Cartographic, Cartesian3 } from 'cesium';
import { GeoJSON } from 'geojson';

export const polygonToGeoJSON = (positions: Cartesian3[]): GeoJSON => {
  const coords = positions.map((vertex: Cartesian3) => {
    const posRadians = Cartographic.fromCartesian(vertex);
    return [
      CesiumMath.toDegrees(posRadians.longitude),
      CesiumMath.toDegrees(posRadians.latitude),
    ];
  });

  // close polygon
  coords.push(coords[0]);

  return {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [coords],
    },
  };
};
