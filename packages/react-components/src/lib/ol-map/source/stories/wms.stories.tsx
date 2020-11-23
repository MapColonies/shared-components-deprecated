import React from 'react';
import { CSFStory } from '../../../utils/story';
import { Map } from '../../map';
import { TileLayer } from '../../layers/tile-layer';
import { getWMSOptions, TileWMS } from '../wms';

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
  title: 'Map/Map Tiles/WMS',
  component: TileWMS,
};

export const Basic: CSFStory<JSX.Element> = () => (
  <div style={mapDivStyle}>
    <Map allowFullScreen={true} showMousePosition={true}>
      <TileLayer>
        <TileWMS options={wmsOptions} />
      </TileLayer>
    </Map>
  </div>
);

Basic.argTypes = {
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
