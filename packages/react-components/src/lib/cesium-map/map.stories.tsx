import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import { CesiumMap } from './map';

export default {
  title: 'Cesium Map',
  component: CesiumMap,
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
    <CesiumMap {...args}>

    </CesiumMap>
  </div>
);

BaseMap.argTypes = {
  // projection: {
  //   defaultValue: Proj.WGS84,
  //   control: {
  //     disable: true,
  //     type: 'radio',
  //     options: [Proj.WEB_MERCATOR, Proj.WGS84],
  //   },
  // },
  zoom: {
    defaultValue: 3,
    control: {
      type: 'range',
      min: 0,
      max: 20,
    },
  },
};
