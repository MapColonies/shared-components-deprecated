import React from 'react';
import { Style, Fill, Circle, Stroke } from 'ol/style';
import { Proj } from '../../../utils/projections';
import { VectorTileLayer } from '../../layers/vector-tile-layer';
import { Map } from '../../map';
import { TileLayer } from '../../layers';
import { MVTSource, getMVTOptions } from '../mvt';
import { TileOsm } from '..';

export default {
  title: 'Map/Map Tiles/MVT',
  component: VectorTileLayer,
  subcomponents: MVTSource,
  parameters: {
    layout: 'fullscreen',
  },
};

const mapDivStyle = {
  height: '100%',
  width: '100%',
  position: 'absolute' as const,
};

export const Basic = (): JSX.Element => (
  <div style={mapDivStyle}>
    <Map projection={Proj.WEB_MERCATOR}>
      <TileLayer>
        <TileOsm />
      </TileLayer>
      <VectorTileLayer>
        <MVTSource
          options={getMVTOptions({
            url: 'http://localhost:9090/maps/osm/{z}/{x}/{y}.pbf',
          })}
        />
      </VectorTileLayer>
    </Map>
  </div>
);

export const Styled = (): JSX.Element => (
  <div style={mapDivStyle}>
    <Map projection={Proj.WEB_MERCATOR}>
      <TileLayer>
        <TileOsm />
      </TileLayer>
      <VectorTileLayer
        style={
          new Style({
            fill: new Fill({ color: 'red' }),
            image: new Circle({
              fill: new Fill({ color: 'orange' }),
              radius: 1,
            }),
            stroke: new Stroke({ color: 'blue' }),
          })
        }
      >
        <MVTSource
          options={getMVTOptions({
            url: 'http://localhost:9090/maps/osm/{z}/{x}/{y}.pbf',
          })}
        />
      </VectorTileLayer>
    </Map>
  </div>
);
