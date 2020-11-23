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
