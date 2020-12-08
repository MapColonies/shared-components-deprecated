import { FeatureCollection, Feature, Point } from 'geojson';
import { Rectangle } from 'cesium';
import { PrimitiveCoordinates } from '../../data-sources';
import { DrawType } from '../../../models/enums';

export const geoJSONToPrimitive = (
  type: DrawType,
  geojson: FeatureCollection
): PrimitiveCoordinates | never => {
  switch (type) {
    case DrawType.BOX:
      if(geojson.features.length !== 2)
        throw new Error(`${type} must have 2 points`);

      return Rectangle.fromDegrees(
        (geojson.features[1] as Feature<Point>).geometry.coordinates[0],
        (geojson.features[1] as Feature<Point>).geometry.coordinates[1],
        (geojson.features[0] as Feature<Point>).geometry.coordinates[0],
        (geojson.features[0] as Feature<Point>).geometry.coordinates[1],
      );
    default:
      throw new Error(`${type} type geoJSON still not supported`);
  }
};
