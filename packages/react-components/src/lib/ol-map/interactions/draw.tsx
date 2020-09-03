import React, { useEffect } from 'react';
import { Draw } from 'ol/interaction';
import {
  createBox,
  DrawEvent,
  Options as DrawOptions,
} from 'ol/interaction/Draw';
import GeometryType from 'ol/geom/GeometryType';
import { GeoJSON } from 'ol/format';
import { Geometry } from 'geojson';
import { useMap } from '../map';
import { DrawType } from '../../models/enums';

export interface DrawProps {
  drawType: DrawType;
  onPolygonSelected?: (geometry: Geometry) => void;
}

export const DrawInteraction: React.FC<DrawProps> = ({
  drawType,
  onPolygonSelected,
}) => {
  const map = useMap();

  useEffect(() => {
    const options: DrawOptions = { type: GeometryType.CIRCLE };
    switch (drawType) {
      case DrawType.BOX:
        options.geometryFunction = createBox();
        break;
      case DrawType.POLYGON:
        options.type = GeometryType.POLYGON;
        break;
      default:
        return;
    }

    const draw = new Draw(options);
    map.addInteraction(draw);

    const onDrawEnd = (e: DrawEvent): void => {
      const geoJson = new GeoJSON();
      const geom = geoJson.writeGeometryObject(e.feature.getGeometry());
      onPolygonSelected?.(geom);
    };

    draw.on('drawend', onDrawEnd);

    return (): void => {
      draw.un('drawend', onDrawEnd);
      map.removeInteraction(draw);
    };
  }, [onPolygonSelected, drawType, map]);

  return null;
};
