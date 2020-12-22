import React, { useState } from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import { CesiumMap } from '../map';
import { CesiumSceneMode } from '../map.types';
import { CesiumOSMLayer } from './osm.layer';
import { CesiumXYZLayer } from './xyz.layer';

export default {
  title: 'Cesium Map/Layers/OSMLayer',
  component: CesiumOSMLayer,
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

const mapDivStyle = {
  height: '100%',
  width: '100%',
  position: 'absolute' as const,
};

const optionsOSM = {
  url: 'https://a.tile.openstreetmap.org/',
};
const optionsXYZ = {
  url: `https://tiles.openaerialmap.org/5b25fa612b6a08001185f80f/0/5b25fa612b6a08001185f810/{z}/{x}/{y}.png`,
};

export const MapWithOSMLayers: Story = (args) => {
  const [center] = useState<[number, number]>([34.82, 32.04]);
  return (
    <div style={mapDivStyle}>
      <CesiumMap center={center} sceneMode={CesiumSceneMode.SCENE2D} zoom={14}>
        <CesiumOSMLayer options={optionsOSM} />
        <CesiumXYZLayer options={optionsXYZ} />
      </CesiumMap>
    </div>
  );
};
MapWithOSMLayers.storyName = 'OSM layer and XYZ';
