import React from 'react';
import { Map } from '../../map';
import { getXYZOptions, TileXYZ } from '../xyz';
import { TileOsm } from '../osm';
import { TileLayer } from '../../layers/tile-layer';
import { CSFStory } from '../../../../utils/story';

const xyzOptions = getXYZOptions({
  url:
  'https://{a-c}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png' +
  '?apikey=0e6fc415256d4fbb9b5166a718591d71',
});

const mapDivStyle = {
  height: '95%',
  width: '95%',
  position: 'absolute' as const ,
};

export default {
  title: 'Map Tiles - XYZ',
  component: TileXYZ,
};

export const XYZ: CSFStory<JSX.Element> = () => (
  <div style={mapDivStyle}>
    <Map allowFullScreen={true} showMousePosition={true}>
      <TileLayer>
        <TileOsm />
      </TileLayer>
      <TileLayer>
        <TileXYZ options={xyzOptions}/>
      </TileLayer>
    </Map>
  </div>
);

XYZ.argTypes = {
  options: {
    description: `{ Options } from 'ol/source/XYZ'`,
    table: {
      type: { 
          summary: 'OpenLayers type', 
          detail: 'Go to "https://openlayers.org/en/latest/apidoc/module-ol_source_XYZ-XYZ.html"' 
      },
    },
    control: {
      type: null,
    },
  },
};
