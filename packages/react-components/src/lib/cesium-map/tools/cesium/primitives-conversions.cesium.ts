import { Rectangle, Cartesian3 } from 'cesium';
import * as turf from '@turf/helpers';
import bbox from '@turf/bbox';
import bboxPolygon from '@turf/bbox-polygon';

export const rectangleToPositions = (positions: Rectangle): Cartesian3[] => {
  const line = turf.lineString([
    [positions.west, positions.south],
    [positions.east, positions.north],
  ]);
  const polygon = bboxPolygon(bbox(line));
  return polygon.geometry.coordinates[0].map(
    (coord) => Cartesian3.fromRadiansArray(coord)[0]
  );
};
