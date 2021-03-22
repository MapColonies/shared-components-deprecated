import React, { useState } from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import { CesiumMap } from '../map';
import { CesiumXYZLayer } from '../layers/xyz.layer';
import { CesiumSceneMode } from '../map.types';

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

const optionsXYZ = {
  url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
};

const optionsXYZ2 = {
  url:
    'https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=0e6fc415256d4fbb9b5166a718591d71',
};

const optionsXYZSanDiego = {
  url:
    'https://tiles.openaerialmap.org/5d73614588556200055f10d6/0/5d73614588556200055f10d7/{z}/{x}/{y}',
};

const optionsXYZParcDuCastrum = {
  url:
    'https://tiles.openaerialmap.org/5c445eabf3771a00054604f2/0/5c445eabf3771a00054604f3/{z}/{x}/{y}',
};


export const MapWithSettings: Story = () => {
  const [center] = useState<[number, number]>([-117.30644008676421, 33.117098433617564]); //Sandiego
  // const [center] = useState<[number, number]>([6.641359744039361, 46.77575730527394]); 
  return (
    <div style={mapDivStyle}>
      <CesiumMap
        center={center}
        zoom={14}
        imageryProvider = { false }
        sceneModes = {[CesiumSceneMode.SCENE3D, CesiumSceneMode.COLUMBUS_VIEW]}
        baseMaps={{
          maps: [
            {
              id: '1st',
              title: '1st Map Title',
              thumbnail: 'https://nsw.digitaltwin.terria.io/build/3456d1802ab2ef330ae2732387726771.png',
              baseRasteLayers: [
                {
                  id: 'GOOGLE_TERRAIN',
                  type:  'XYZ_LAYER',
                  opacity: 1,
                  zIndex: 0,
                  options: {
                    url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
                    layers: '',
                    credit: 'GOOGLE',
                  }
                },
                {
                  id: 'INFRARED_RASTER',
                  type:  'WMS_LAYER',
                  opacity: 0.6,
                  zIndex: 1,
                  options: {
                    url: 'https://mesonet.agron.iastate.edu/cgi-bin/wms/goes/conus_ir.cgi?',
                    layers: 'goes_conus_ir',
                    credit: 'Infrared data courtesy Iowa Environmental Mesonet',
                    parameters: {
                      transparent: 'true',
                      format: 'image/png',
                    },
                  }
                }
              ],
              baseVectorLayers: [],
            },
            {
              id: '2nd',
              title: '2nd Map Title',
              thumbnail: 'https://nsw.digitaltwin.terria.io/build/efa2f6c408eb790753a9b5fb2f3dc678.png',
              baseRasteLayers: [{
                id: 'RADAR_RASTER',
                type:  'WMS_LAYER',
                opacity: 1,
                zIndex: 0,
                options: {
                  url: 'https://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi?',
                  layers: 'nexrad-n0r',
                  credit: 'Radar data courtesy Iowa Environmental Mesonet',
                  parameters: {
                    transparent: 'true',
                    format: 'image/png',
                  },
              }
              }],
              baseVectorLayers: [],
            }
          ]
        }}
      >
        <CesiumXYZLayer options={optionsXYZSanDiego} />
        {/* <CesiumXYZLayer options={optionsXYZParcDuCastrum} /> */}
        {/* <CesiumXYZLayer options={optionsXYZ} /> */}
        {/* <CesiumXYZLayer options={optionsXYZ2} alpha={0.5} /> */}
      </CesiumMap>
    </div>
  );
}
MapWithSettings.storyName = 'Map Settings';
