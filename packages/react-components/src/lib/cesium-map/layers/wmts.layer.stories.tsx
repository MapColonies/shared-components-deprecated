import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import { Credit } from 'cesium';
import { CesiumMap } from '../map';
import { CesiumWMTSLayer } from './wmts.layer';

export default {
  title: 'Cesium Map/Layers/WMTSLayer',
  component: CesiumWMTSLayer,
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

const mapDivStyle = {
  height: '100%',
  width: '100%',
  position: 'absolute' as const,
};

const optionsWMTS = {
  url:
    'http://basemap.nationalmap.gov/arcgis/rest/services/USGSShadedReliefOnly/MapServer/WMTS',
  layer: 'USGSShadedReliefOnly',
  style: 'default',
  format: 'image/jpeg',
  tileMatrixSetID: 'default028mm',
  // tileMatrixLabels : ['default028mm:0', 'default028mm:1', 'default028mm:2' ...],
  maximumLevel: 19,
  credit: new Credit('U. S. Geological Survey'),
};

const optionsWMTS2 = {
  url:
    'https://services.arcgisonline.com/arcgis/rest/services/Demographics/USA_Population_Density/MapServer/WMTS/',
  layer: 'USGSShadedReliefOnly',
  style: 'default',
  format: 'image/jpeg',
  tileMatrixSetID: 'default028mm',
  // tileMatrixLabels : ['default028mm:0', 'default028mm:1', 'default028mm:2' ...],
  maximumLevel: 19,
  credit: new Credit('U. S. Geological Survey'),
};

export const MapWithWMTSLayers: Story = () => (
  <div style={mapDivStyle}>
    <CesiumMap>
      <CesiumWMTSLayer options={optionsWMTS} />
      <CesiumWMTSLayer options={optionsWMTS2} alpha={0.5} />
    </CesiumMap>
  </div>
);
MapWithWMTSLayers.storyName = 'WMTS 2 layers';
