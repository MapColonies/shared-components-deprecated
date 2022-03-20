import React from 'react';
import { ArcGISTiledElevationTerrainProvider } from 'cesium';
import { Story, Meta } from '@storybook/react/types-6-0';
import { action } from '@storybook/addon-actions';
import { CesiumMap } from '../map';
import { LayerType } from '../layers-manager';
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

const BASE_MAPS = {
  maps: [
    {
      id: '1st',
      title: '1st Map Title',
      isCurrent: true,
      thumbnail:
        'https://nsw.digitaltwin.terria.io/build/efa2f6c408eb790753a9b5fb2f3dc678.png',
      baseRasteLayers: [
        {
          id: 'GOOGLE_TERRAIN',
          type: 'XYZ_LAYER' as LayerType,
          opacity: 1,
          zIndex: 0,
          options: {
            url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
            layers: '',
            credit: 'GOOGLE',
          },
        },
      ],
      baseVectorLayers: [],
    },
  ],
};

const ArcGisProvider = new ArcGISTiledElevationTerrainProvider({
  url:
    'https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer',
});

export const Cesium3DTilesetLayer: Story = (args: unknown) => (
  <div style={mapDivStyle}>
    <CesiumMap baseMaps={BASE_MAPS} {...args}>
      <Cesium3DTileset
        isZoomTo={true}
        url="/mock/tileset_1/tileset.json"
        onAllTilesLoad={action('onAllTilesLoad')}
        onInitialTilesLoad={action('onInitialTilesLoad')}
        onTileFailed={action('onTileFailed')}
        onTileLoad={action('onTileLoad')}
        onTileUnload={action('onTileUnload')}
        onReady={(tileset): void => {
          action('onReady');
        }}
        onClick={action('onClick')}
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

export const Cesium3DTilesetOnHeightLayer: Story = (args: unknown) => (
  <div style={mapDivStyle}>
    <CesiumMap baseMaps={BASE_MAPS} {...args}>
      <Cesium3DTileset
        isZoomTo={false}
        heightFromGround={-10}
        url="/mock/tileset_1/tileset.json"
        onAllTilesLoad={action('onAllTilesLoad')}
        onInitialTilesLoad={action('onInitialTilesLoad')}
        onTileFailed={action('onTileFailed')}
        onTileLoad={action('onTileLoad')}
        onTileUnload={action('onTileUnload')}
        onReady={(tileset): void => {
          action('onReady');
        }}
        onClick={action('onClick')}
      />
    </CesiumMap>
  </div>
);

Cesium3DTilesetOnHeightLayer.argTypes = {
  zoom: {
    defaultValue: 18,
    control: {
      type: 'range',
      min: 0,
      max: 20,
    },
  },
  center: {
    defaultValue: [-75.61208, 40.04227],
  },
};

export const CesiumSolar3DTilesetLayer: Story = (args: unknown) => (
  <div style={mapDivStyle}>
    <CesiumMap baseMaps={BASE_MAPS} terrainProvider={ArcGisProvider} {...args}>
      <Cesium3DTileset
        isZoomTo={true}
        url="/mock/tileset_2/L16_31023/L16_31023.json"
      />
    </CesiumMap>
  </div>
);

CesiumSolar3DTilesetLayer.argTypes = {
  center: {
    defaultValue: [34.811, 31.908],
  },
  zoom: {
    defaultValue: 14,
    control: {
      type: 'range',
      min: 0,
      max: 20,
    },
  },
};
