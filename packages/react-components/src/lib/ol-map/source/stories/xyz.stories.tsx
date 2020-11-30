import React from 'react';
import { Proj } from '../../../utils/projections';
import { CSFStory } from '../../../utils/story';
import { Map } from '../../map';
import { TileLayer } from '../../layers/tile-layer';
import { getXYZOptions, TileXYZ } from '../xyz';

const xyzOptions = getXYZOptions({
  url:
    'https://{a-c}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png' +
    '?apikey=0e6fc415256d4fbb9b5166a718591d71',
});

const mapDivStyle = {
  height: '95%',
  width: '95%',
  position: 'absolute' as const,
};

export default {
  title: 'Map/Map Tiles/XYZ',
  component: TileXYZ,
};

export const Basic: CSFStory<JSX.Element> = () => (
  <div style={mapDivStyle}>
    <Map
      allowFullScreen={true}
      showMousePosition={true}
      projection={Proj.WEB_MERCATOR}
    >
      <TileLayer>
        <TileXYZ options={xyzOptions} />
      </TileLayer>
    </Map>
  </div>
);

Basic.argTypes = {
  options: {
    description: `{ Options } from 'ol/source/XYZ'`,
    table: {
      type: {
        summary: 'OpenLayers type',
        detail:
          'Go to "https://openlayers.org/en/latest/apidoc/module-ol_source_XYZ-XYZ.html"',
      },
    },
    control: {
      type: null,
    },
  },
};
