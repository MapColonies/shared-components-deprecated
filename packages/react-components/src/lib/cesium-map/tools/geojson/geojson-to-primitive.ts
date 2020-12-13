import { FeatureCollection, Feature, Point } from 'geojson';
import { Rectangle } from 'cesium';
import { find } from 'lodash';
import { PrimitiveCoordinates } from '../../data-sources';
import { BboxCorner, DrawType } from '../../../models/enums';

const POINTS_NUM = 2;

export const geoJSONToPrimitive = (
  type: DrawType,
  geojson: FeatureCollection
): PrimitiveCoordinates | never => {
  switch (type) {
    case DrawType.BOX: {
      if (geojson.features.length !== POINTS_NUM)
        throw new Error(`${type} must have 2 points`);

      const bottomLeftPoint = find(geojson.features, (feat) => {
        return feat.properties?.type === BboxCorner.BOTTOM_LEFT;
      }) as Feature<Point>;

      const rightTopPoint = find(geojson.features, (feat) => {
        return feat.properties?.type === BboxCorner.TOP_RIGHT;
      }) as Feature<Point>;

      if (rightTopPoint && bottomLeftPoint) {
        if(bottomLeftPoint.geometry.coordinates[0] === rightTopPoint.geometry.coordinates[0] &&
          bottomLeftPoint.geometry.coordinates[1] === rightTopPoint.geometry.coordinates[1]
          ){
            throw new Error(
              `${type} must define BOTTOM_LEFT and TOP_RIGHT different points`
            ); 
        }
        else{
          return Rectangle.fromDegrees(
            bottomLeftPoint.geometry.coordinates[0],
            bottomLeftPoint.geometry.coordinates[1],
            rightTopPoint.geometry.coordinates[0],
            rightTopPoint.geometry.coordinates[1]
          );
        }
      } else {
        throw new Error(
          `${type} geojson must define BOTTOM_LEFT and TOP_RIGHT points`
        );
      }
    }
    default:
      throw new Error(`${type} type geoJSON still not supported`);
  }
};
