import React from 'react';
import { CSFStory } from '../../../utils/story';
import { Map } from '../../map';
import { TileLayer } from '../../layers/tile-layer';
import { getWMTSOptions, TileWMTS } from '../wmts';
import { TileOsm } from '../osm';

const wmtsOptions = getWMTSOptions({
  attributions: 'Tiles © ArcGIS',
  url:
    'https://services.arcgisonline.com/arcgis/rest/services/Demographics/USA_Population_Density/MapServer/WMTS/',
  layer: '0',
  projection: 'EPSG:3857',
  format: 'image/png',
  style: 'default',
  matrixSet: 'EPSG:3857',
  heightWidthRatio: 1,
  requestEncoding: 'KVP',
});

const wmtsOptions1 = getWMTSOptions({
  url:
    'http://10.28.11.95:8080/wmts/{Layer}/{TileMatrixSet}/{TileMatrix}/{TileCol}/{TileRow}.png',
  layer: 'combined_layers',
  matrixSet: 'gridname',
  format: 'png',
  projection: 'EPSG:4326',
  style: 'default',
});

const mapDivStyle = {
  height: '95%',
  width: '95%',
  position: 'absolute' as const,
};

export default {
  title: 'Map/Map Tiles/WMTS',
  component: TileWMTS,
};

export const Basic: CSFStory<JSX.Element> = () => (
  <div style={mapDivStyle}>
    <Map allowFullScreen={true} showMousePosition={true}>
      <TileLayer>
        <TileOsm />
      </TileLayer>
      <TileLayer>
        <TileWMTS options={wmtsOptions} />
      </TileLayer>
      <TileLayer options={{ opacity: 0.4 }}>
        <TileWMTS options={wmtsOptions1} />
      </TileLayer>
    </Map>
  </div>
);

Basic.argTypes = {
  options: {
    description: `{ Options } from 'ol/source/WMTS'`,
    table: {
      type: {
        summary: 'OpenLayers type',
        detail:
          'Go to "https://openlayers.org/en/latest/apidoc/module-ol_source_WMTS-WMTS.html"',
      },
    },
    control: {
      type: null,
    },
  },
};
