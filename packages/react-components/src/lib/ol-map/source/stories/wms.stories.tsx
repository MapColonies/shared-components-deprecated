import React from 'react';
import { Map } from '../../map';
import { getWMSOptions, TileWMS } from '../wms';
import { TileOsm } from '../osm';
import { TileLayer } from '../../layers/tile-layer';
import { CSFStory } from '../../../utils/story';

const wmsOptions = getWMSOptions({
  url: 'https://ahocevar.com/geoserver/wms',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  params: { LAYERS: 'ne:NE1_HR_LC_SR_W_DR', TILED: true },
  serverType: 'geoserver',
  // Countries have transparency, so do not fade tiles:
  transition: 0.5,
});

const mapDivStyle = {
  height: '95%',
  width: '95%',
  position: 'absolute' as const,
};

export default {
  title: 'Map Tiles - WMS',
  component: TileWMS,
};

export const WMS: CSFStory<JSX.Element> = () => (
  <div style={mapDivStyle}>
    <Map allowFullScreen={true} showMousePosition={true}>
      <TileLayer>
        <TileOsm />
      </TileLayer>
      <TileLayer>
        <TileWMS options={wmsOptions} />
      </TileLayer>
    </Map>
  </div>
);

WMS.argTypes = {
  options: {
    description: `{ Options } from 'ol/source/TileWMS'`,
    table: {
      type: {
        summary: 'OpenLayers type',
        detail:
          'Go to "https://openlayers.org/en/latest/apidoc/module-ol_source_TileWMS-TileWMS.html"',
      },
    },
    control: {
      type: null,
    },
  },
};
