import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import { CesiumMap } from '../map';
import { CesiumWMSLayer } from './wms.layer';

export default {
  title: 'Cesium Map/Layers/WMSLayer',
  component: CesiumWMSLayer,
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

const mapDivStyle = {
  height: '100%',
  width: '100%',
  position: 'absolute' as const,
};

const optionsWMS = {
  url: 'https://ahocevar.com/geoserver/wms',
  layers: 'ne:NE1_HR_LC_SR_W_DR',
};

const optionsWMS2 = {
  url: 'https://ahocevar.com/geoserver/wms',
  layers: 'opengeo:countries',
};

export const MapWithWMSLayers: Story = () => (
  <div style={mapDivStyle}>
    <CesiumMap>
      <CesiumWMSLayer options={optionsWMS} />
      <CesiumWMSLayer options={optionsWMS2} alpha={0.3} />
    </CesiumMap>
  </div>
);
MapWithWMSLayers.storyName = 'WMS 2 layers';
