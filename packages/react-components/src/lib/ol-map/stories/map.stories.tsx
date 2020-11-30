import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import { Map } from '../map';
import { TileOsm } from '../source';
import { TileLayer } from '../layers';
import { Proj } from '../../utils/projections';

export default {
  title: 'Map',
  component: Map,
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

const mapDivStyle = {
  height: '100%',
  width: '100%',
  position: 'absolute' as const,
};

export const BaseMap: Story = (args: unknown) => (
  <div style={mapDivStyle}>
    <Map {...args}>
      <TileLayer>
        <TileOsm />
      </TileLayer>
    </Map>
  </div>
);

BaseMap.argTypes = {
  projection: {
    defaultValue: Proj.WGS84,
    control: {
      type: 'radio',
      options: [Proj.WEB_MERCATOR, Proj.WGS84],
    },
  },
  zoom: {
    defaultValue: 3,
    control: {
      type: 'range',
      min: 0,
      max: 20,
    },
  },
};

export const ConfiguredMap: Story = () => (
  <div style={mapDivStyle}>
    <Map zoom={3} center={[0, 0]}>
      <TileLayer>
        <TileOsm />
      </TileLayer>
    </Map>
  </div>
);

ConfiguredMap.storyName = 'with zoom and center';
