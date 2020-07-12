import React from 'react';
import { observer } from 'mobx-react-lite';
import { Map } from '../../common/components/ol-map/map';
import { useStore } from '../models/rootStore';
import { TileLayer } from '../../common/components/ol-map/layers/tile-layer';
import { TileOsm } from '../../common/components/ol-map/source/osm';
import { VectorLayer } from '../../common/components/ol-map/layers/vector-layer';
import { VectorSource } from '../../common/components/ol-map/source/vector-source';
import { GeoJSONFeature } from '../../common/components/ol-map/feature';
import { DrawInteraction } from '../../common/components/ol-map/interactions/draw';
import { Geometry } from 'geojson';
import rewind from '@turf/rewind';
import { Polygon } from '@turf/helpers';

const ConflictMap: React.FC = observer(() => {
  const { conflictsStore, mapStore } = useStore();

  const onPolygonSelected = (geometry: Geometry) => {
    const rewindedPolygon = rewind(geometry as Polygon);
    conflictsStore.searchParams.setLocation(rewindedPolygon);
    mapStore.setGeometry(rewindedPolygon);
  };

  return (
    <Map>
      <TileLayer><TileOsm />
      </TileLayer>
      <VectorLayer>
        <VectorSource>
          {conflictsStore.conflicts.map((conflict, index) => <GeoJSONFeature key={index} geometry={conflict.location} />)}
        </VectorSource>
      </VectorLayer>
      {mapStore.currentGeometry && <VectorLayer>
        <VectorSource>
          <GeoJSONFeature geometry={mapStore.currentGeometry} />
        </VectorSource>
      </VectorLayer>}
      {mapStore.drawState !== null && <DrawInteraction drawType={mapStore.drawState} onPolygonSelected={onPolygonSelected} />}
    </Map >
  );
});

export default ConflictMap;
