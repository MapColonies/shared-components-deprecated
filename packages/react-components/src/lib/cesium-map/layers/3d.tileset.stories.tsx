import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import { action } from '@storybook/addon-actions';
import { CesiumMap } from '../map';
import { Cesium3DTileset } from './3d.tileset';

export default {
  title: 'Cesium Map/Layers/3DTileset',
  component: Cesium3DTileset,
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

const mapDivStyle = {
  height: '100%',
  width: '100%',
  position: 'absolute' as const,
};

export const Cesium3DTilesetLayer: Story = (args: unknown) => (
  <div style={mapDivStyle}>
    <CesiumMap {...args}>
      <Cesium3DTileset
        url="/mock/tileset/tileset.json"
        onAllTilesLoad={action("onAllTilesLoad")}
        onInitialTilesLoad={action("onInitialTilesLoad")}
        onTileFailed={action("onTileFailed")}
        onTileLoad={action("onTileLoad")}
        onTileUnload={action("onTileUnload")}
        onReady={(tileset):void => {
          action("onReady");
        }}
        onClick={action("onClick")}
      />
    </CesiumMap>
  </div>
);

Cesium3DTilesetLayer.argTypes = {
  zoom: {
    defaultValue: 3,
    control: {
      type: 'range',
      min: 0,
      max: 20,
    },
  },
};
