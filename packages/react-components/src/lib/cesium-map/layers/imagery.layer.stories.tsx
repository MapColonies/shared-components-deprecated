import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import { ArcGisMapServerImageryProvider, IonImageryProvider } from 'cesium';
import { CesiumMap } from '../map';
import { CesiumImageryLayer } from './imagery.layer';

export default {
  title: 'Cesium Map/Layers/ImageryLayer',
  component: CesiumImageryLayer,
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

const mapDivStyle = {
  height: '100%',
  width: '100%',
  position: 'absolute' as const,
};

export const MapWithImageryLayers: Story = () => (
  <div style={mapDivStyle}>
    <CesiumMap>
      <CesiumImageryLayer
        imageryProvider={
          new ArcGisMapServerImageryProvider({
            url:
              '//services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer',
          })
        }
      />
      <CesiumImageryLayer
        alpha={0.5}
        imageryProvider={new IonImageryProvider({ assetId: 3812 })}
      />
    </CesiumMap>
  </div>
);
MapWithImageryLayers.storyName = 'With 2 imagery layers';
