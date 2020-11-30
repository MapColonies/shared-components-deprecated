import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import { CesiumMap } from '../map';
import { CesiumXYZLayer } from './xyz.layer';

export default {
  title: 'Cesium Map/Layers/XYZLayer',
  component: CesiumXYZLayer,
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

const mapDivStyle = {
  height: '100%',
  width: '100%',
  position: 'absolute' as const,
};

const optionsXYZ = {
  url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
};

const optionsXYZ2 = {
  url:
    'https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=0e6fc415256d4fbb9b5166a718591d71',
};

export const MapWithXYZLayers: Story = () => (
  <div style={mapDivStyle}>
    <CesiumMap>
      <CesiumXYZLayer options={optionsXYZ} />
      <CesiumXYZLayer options={optionsXYZ2} alpha={0.5} />
    </CesiumMap>
  </div>
);
MapWithXYZLayers.storyName = 'XYZ 2 layers';
