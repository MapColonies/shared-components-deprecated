import React from 'react';
import { Meta } from '@storybook/react/types-6-0';
import { VectorTileLayer } from '../../layers/vector-tile-layer';
import { Map } from '../../map';
import { MVTSource, getMVTOptions } from '../mvt';
import { TileOsm } from '..';
import { TileLayer } from '../../layers';
import { Proj } from '../../projections';

export default {
  title: 'Map Tiles - MVT',
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
