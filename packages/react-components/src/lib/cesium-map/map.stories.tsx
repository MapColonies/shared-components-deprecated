import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import { CesiumMap, MapProps } from './map';
import { Proj } from '.';

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

export const BaseMap: Story = (args: MapProps) => (
  <div style={mapDivStyle}>
    <CesiumMap {...args}>

    </CesiumMap>
  </div>
);

export const ZommedMap: Story = (args: MapProps) => (
  <div style={mapDivStyle}>
    <CesiumMap {...args}>

    </CesiumMap>
  </div>
);

ZommedMap.argTypes = {
  center: {
    defaultValue:[34.9578094, 32.8178637]
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

export const MapWithProjection: Story = (args: MapProps) => (
  <div style={mapDivStyle}>
    <CesiumMap {...args}>

    </CesiumMap>
  </div>
);

MapWithProjection.argTypes = {
  center: {
    defaultValue:[34.9578094, 32.8178637]
  },
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

export const LocalizedMap: Story = (args: MapProps) => (
  <div style={mapDivStyle}>
    <CesiumMap {...args}>

    </CesiumMap>
  </div>
);

LocalizedMap.argTypes = {
  center: {
    defaultValue:[34.9578094, 32.8178637]
  },
  locale: {
    defaultValue:{
      METERS_UNIT: "מ'",
      KILOMETERS_UNIT: "קמ'"
    }
  },
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
LocalizedMap.storyName = 'Localized Map (ctrl+F5)';

