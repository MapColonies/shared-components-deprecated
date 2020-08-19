import React from 'react';
import { Geometry } from 'geojson';
import rewind from '@turf/rewind';
import { Polygon } from 'geojson';
import { Map } from '../ol-map/map';
import { TileLayer } from '../ol-map/layers/tile-layer';
import { VectorSource } from '../ol-map/source/vector-source';
import { GeoJSONFeature } from '../ol-map/feature';
import { TileOsm } from '../ol-map/source/osm';
import { VectorLayer } from '../ol-map/layers/vector-layer';
import { DrawInteraction } from '../ol-map/interactions/draw';
import { DrawType } from '../models/enums';
import './container-map.css';

interface ContainerMapProps {
  drawType?: DrawType;
  selectionPolygon?: Polygon;
  onPolygonSelection: (polygon: Polygon) => void;
}

export const ContainerMap: React.FC<ContainerMapProps> = (props) => {
  const handlePolygonSelected = (geometry: Geometry): void => {
    const rewindedPolygon = rewind(geometry as Polygon);
    props.onPolygonSelection(rewindedPolygon);
  };

  return (
    <Map allowFullScreen={true} showMousePosition={true}>
      <TileLayer>
        <TileOsm />
      </TileLayer>
      {props.selectionPolygon && (
        <VectorLayer>
          <VectorSource>
            <GeoJSONFeature geometry={props.selectionPolygon} />
          </VectorSource>
        </VectorLayer>
      )}
      {props.children}
      {props.drawType !== undefined && (
        <DrawInteraction
          drawType={props.drawType}
          onPolygonSelected={handlePolygonSelected}
        />
      )}
    </Map>
  );
};
