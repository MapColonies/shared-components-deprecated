import { FeatureCollection, Feature } from 'geojson';
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

      /* eslint-disable @typescript-eslint/no-unsafe-member-access */
      return Rectangle.fromDegrees(
        (geojson.features[1].geometry as Feature).coordinates[0],
        (geojson.features[1].geometry as Feature).coordinates[1],
        (geojson.features[0].geometry as Feature).coordinates[0],
        (geojson.features[0].geometry as Feature).coordinates[1],
      );
    default:
      throw new Error(`${type} type geoJSON still not supported`);
  }
};
