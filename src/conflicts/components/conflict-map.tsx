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

const ConflictMap: React.FC = observer(() => {
  const { conflictsStore, mapStore } = useStore();

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
      {mapStore.drawState !== null && <DrawInteraction drawType={mapStore.drawState} onPolygonSelected={mapStore.setGeometry} />}
    </Map >
  );
});

export default ConflictMap;
