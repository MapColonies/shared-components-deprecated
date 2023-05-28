import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import { CesiumMap, CesiumMapProps } from './map';
import { CesiumSceneMode } from './map.types';
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

export const BaseMap: Story = (args: CesiumMapProps) => (
  <div style={mapDivStyle}>
    <CesiumMap {...args}></CesiumMap>
  </div>
);

export const ZoomedMap: Story = (args: CesiumMapProps) => (
  <div style={mapDivStyle}>
    <CesiumMap {...args}></CesiumMap>
  </div>
);

ZoomedMap.argTypes = {
  center: {
    defaultValue: [34.9578094, 32.8178637],
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

export const MapWithProjection: Story = (args: CesiumMapProps) => (
  <div style={mapDivStyle}>
    <CesiumMap {...args}></CesiumMap>
  </div>
);

MapWithProjection.argTypes = {
  center: {
    defaultValue: [34.9578094, 32.8178637],
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

export const Map2DWithProjection: Story = (args: CesiumMapProps) => (
  <div style={mapDivStyle}>
    <CesiumMap {...args}></CesiumMap>
  </div>
);

Map2DWithProjection.argTypes = {
  center: {
    defaultValue: [34.9578094, 32.8178637],
  },
  sceneMode: {
    defaultValue: CesiumSceneMode.SCENE2D,
  },
  projection: {
    defaultValue: Proj.WGS84,
    control: {
      type: 'radio',
      options: [Proj.WEB_MERCATOR, Proj.WGS84],
    },
  },
  zoom: {
    defaultValue: 8,
    control: {
      type: 'range',
      min: 0,
      max: 20,
    },
  },
};
Map2DWithProjection.storyName = '2D Map With Projection';

export const LocalizedMap: Story = (args: CesiumMapProps) => (
  <div style={mapDivStyle}>
    <CesiumMap {...args}></CesiumMap>
  </div>
);

LocalizedMap.argTypes = {
  center: {
    defaultValue: [34.9578094, 32.8178637],
  },
  locale: {
    /* eslint-disable @typescript-eslint/naming-convention */
    defaultValue: {
      METERS_UNIT: "מ'",
      KILOMETERS_UNIT: "קמ'",
      MAP_SETTINGS_DIALOG_TITLE: 'הגדרות מפה',
      MAP_SETTINGS_SCENE_MODE_TITLE: 'תצורה',
      MAP_SETTINGS_BASE_MAP_TITLE: 'מפות בסיס',
      MAP_SETTINGS_OK_BUTTON_TEXT: 'אישור',
      ZOOM_LABEL: 'זום',
    },
    /* eslint-enable @typescript-eslint/naming-convention */
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
