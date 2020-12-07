import { Rectangle, Math as CesiumMath } from 'cesium';
import { GeoJSON } from 'geojson';
import * as turf from '@turf/helpers';
import bbox from '@turf/bbox';
import bboxPolygon from '@turf/bbox-polygon';

export const rectangleToGeoJSON = (positions: Rectangle): GeoJSON => {
  const line = turf.lineString([
    [
      CesiumMath.toDegrees(positions.west),
      CesiumMath.toDegrees(positions.south),
    ],
    [
      CesiumMath.toDegrees(positions.east),
      CesiumMath.toDegrees(positions.north),
    ],
  ]);
  const polygon = bboxPolygon(bbox(line));

  return polygon;
};
