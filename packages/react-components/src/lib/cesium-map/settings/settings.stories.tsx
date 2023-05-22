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

const optionsXYZSanDiego = {
  url:
    'https://tiles.openaerialmap.org/5d73614588556200055f10d6/0/5d73614588556200055f10d7/{z}/{x}/{y}',
};

const BASE_MAPS = {
  maps: [
    {
      id: '1st',
      title: '1st Map Title',
      isCurrent: true,
      thumbnail:
        'https://nsw.digitaltwin.terria.io/build/3456d1802ab2ef330ae2732387726771.png',
      baseRasteLayers: [
        {
          id: 'GOOGLE_TERRAIN',
          type: 'XYZ_LAYER',
          opacity: 1,
          zIndex: 0,
          options: {
            url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
            layers: '',
            credit: 'GOOGLE',
          },
        },
        {
          id: 'INFRARED_RASTER',
          type: 'WMS_LAYER',
          opacity: 0.6,
          zIndex: 1,
          options: {
            url:
              'https://mesonet.agron.iastate.edu/cgi-bin/wms/goes/conus_ir.cgi?',
            layers: 'goes_conus_ir',
            credit: 'Infrared data courtesy Iowa Environmental Mesonet',
            parameters: {
              transparent: 'true',
              format: 'image/png',
            },
          },
        },
      ],
      baseVectorLayers: [],
    },
    {
      id: '2nd',
      title: '2nd Map Title',
      thumbnail:
        'https://nsw.digitaltwin.terria.io/build/efa2f6c408eb790753a9b5fb2f3dc678.png',
      baseRasteLayers: [
        {
          id: 'RADAR_RASTER',
          type: 'WMS_LAYER',
          opacity: 0.6,
          zIndex: 1,
          options: {
            url:
              'https://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi?',
            layers: 'nexrad-n0r',
            credit: 'Radar data courtesy Iowa Environmental Mesonet',
            parameters: {
              transparent: 'true',
              format: 'image/png',
            },
          },
        },
        {
          id: 'GOOGLE_TERRAIN',
          type: 'XYZ_LAYER',
          opacity: 1,
          zIndex: 0,
          options: {
            url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
            layers: '',
            credit: 'GOOGLE',
          },
        },
        {
          id: 'VECTOR_TILES_GPS',
          type: 'XYZ_LAYER',
          opacity: 1,
          zIndex: 2,
          options: {
            url: 'https://gps.tile.openstreetmap.org/lines/{z}/{x}/{y}.png',
            layers: '',
            credit: 'openstreetmap',
          },
        },
      ],
      baseVectorLayers: [],
    },
    {
      id: '3rd',
      title: '3rd Map Title',
      thumbnail:
        'https://nsw.digitaltwin.terria.io/build/d8b97d3e38a0d43e5a06dea9aae17a3e.png',
      baseRasteLayers: [
        {
          id: 'VECTOR_TILES',
          type: 'XYZ_LAYER',
          opacity: 1,
          zIndex: 0,
          options: {
            url:
              'https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=6170aad10dfd42a38d4d8c709a536f38',
            layers: '',
            credit: 'thunderforest',
          },
        },
        {
          id: 'VECTOR_TILES_GPS',
          type: 'XYZ_LAYER',
          opacity: 1,
          zIndex: 1,
          options: {
            url: 'https://gps.tile.openstreetmap.org/lines/{z}/{x}/{y}.png',
            layers: '',
            credit: 'openstreetmap',
          },
        },
        {
          id: 'WMTS_POPULATION_TILES',
          type: 'WMTS_LAYER',
          opacity: 0.4,
          zIndex: 2,
          options: {
            url:
              'https://services.arcgisonline.com/arcgis/rest/services/Demographics/USA_Population_Density/MapServer/WMTS/',
            layer: 'USGSShadedReliefOnly',
            style: 'default',
            format: 'image/jpeg',
            tileMatrixSetID: 'default028mm',
            maximumLevel: 19,
            credit: 'U. S. Geological Survey',
          },
        },
      ],
      baseVectorLayers: [],
    },
  ],
};

export const MapWithSettings: Story = () => {
  const [center] = useState<[number, number]>([
    -117.30644008676421,
    33.117098433617564,
  ]); //Sandiego Poinsettia Park
  return (
    <div style={mapDivStyle}>
      <CesiumMap
        center={center}
        zoom={14}
        imageryProvider={false}
        sceneModes={[
          CesiumSceneMode.SCENE3D,
          CesiumSceneMode.SCENE2D,
          CesiumSceneMode.COLUMBUS_VIEW,
        ]}
        baseMaps={BASE_MAPS}
      >
        <CesiumXYZLayer options={optionsXYZSanDiego} />
      </CesiumMap>
    </div>
  );
};
MapWithSettings.storyName = 'Map Settings';
