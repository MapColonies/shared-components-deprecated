import React, { useState } from 'react';
import {
  ArcGISTiledElevationTerrainProvider,
  Ellipsoid,
  EllipsoidTerrainProvider,
  TerrainProvider,
  VRTheWorldTerrainProvider,
  WebMercatorProjection,
  // WebMercatorTilingScheme,
  GeographicTilingScheme,
  CesiumTerrainProvider,
  Resource,
} from 'cesium';
import { Story, Meta } from '@storybook/react/types-6-0';
import { CesiumMap, useCesiumMap } from '../map';
import { CesiumSceneMode } from '../map.types';
import { Cesium3DTileset } from '../layers';
import QuantizedMeshTerrainProvider from './quantized-mesh.terrain-provider';

export default {
  title: 'Cesium Map',
  component: CesiumMap,
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

const mapDivStyle = {
  height: '90%',
  width: '100%',
  position: 'absolute' as const,
};

const BASE_MAPS = {
  maps: [
    // {
    //   id: '1st',
    //   title: '1st Map Title',
    //   thumbnail:
    //     'https://nsw.digitaltwin.terria.io/build/3456d1802ab2ef330ae2732387726771.png',
    //   baseRasteLayers: [
    //     {
    //       id: 'GOOGLE_TERRAIN',
    //       type: 'XYZ_LAYER',
    //       opacity: 1,
    //       zIndex: 0,
    //       options: {
    //         url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
    //         layers: '',
    //         credit: 'GOOGLE',
    //       },
    //     },
    //     {
    //       id: 'INFRARED_RASTER',
    //       type: 'WMS_LAYER',
    //       opacity: 0.6,
    //       zIndex: 1,
    //       options: {
    //         url:
    //           'https://mesonet.agron.iastate.edu/cgi-bin/wms/goes/conus_ir.cgi?',
    //         layers: 'goes_conus_ir',
    //         credit: 'Infrared data courtesy Iowa Environmental Mesonet',
    //         parameters: {
    //           transparent: 'true',
    //           format: 'image/png',
    //         },
    //       },
    //     },
    //   ],
    //   baseVectorLayers: [],
    // },
    {
      id: '2nd',
      title: '2nd Map Title',
      isCurrent: true,
      thumbnail:
        'https://nsw.digitaltwin.terria.io/build/efa2f6c408eb790753a9b5fb2f3dc678.png',
      baseRasteLayers: [
        // {
        //   id: 'RADAR_RASTER',
        //   type: 'WMS_LAYER',
        //   opacity: 0.6,
        //   zIndex: 1,
        //   options: {
        //     url:
        //       'https://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi?',
        //     layers: 'nexrad-n0r',
        //     credit: 'Radar data courtesy Iowa Environmental Mesonet',
        //     parameters: {
        //       transparent: 'true',
        //       format: 'image/png',
        //     },
        //   },
        // },
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
        // {
        //   id: 'VECTOR_TILES_GPS',
        //   type: 'XYZ_LAYER',
        //   opacity: 1,
        //   zIndex: 2,
        //   options: {
        //     url: 'https://gps.tile.openstreetmap.org/lines/{z}/{x}/{y}.png',
        //     layers: '',
        //     credit: 'openstreetmap',
        //   },
        // },
      ],
      baseVectorLayers: [],
    },
    // {
    //   id: '3rd',
    //   title: '3rd Map Title',
    //   thumbnail:
    //     'https://nsw.digitaltwin.terria.io/build/d8b97d3e38a0d43e5a06dea9aae17a3e.png',
    //   baseRasteLayers: [
    //     {
    //       id: 'VECTOR_TILES',
    //       type: 'XYZ_LAYER',
    //       opacity: 1,
    //       zIndex: 0,
    //       options: {
    //         url:
    //           'https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=6170aad10dfd42a38d4d8c709a536f38',
    //         layers: '',
    //         credit: 'thunderforest',
    //       },
    //     },
    //     {
    //       id: 'VECTOR_TILES_GPS',
    //       type: 'XYZ_LAYER',
    //       opacity: 1,
    //       zIndex: 1,
    //       options: {
    //         url: 'https://gps.tile.openstreetmap.org/lines/{z}/{x}/{y}.png',
    //         layers: '',
    //         credit: 'openstreetmap',
    //       },
    //     },
    //     {
    //       id: 'WMTS_POPULATION_TILES',
    //       type: 'WMTS_LAYER',
    //       opacity: 0.4,
    //       zIndex: 2,
    //       options: {
    //         url:
    //           'https://services.arcgisonline.com/arcgis/rest/services/Demographics/USA_Population_Density/MapServer/WMTS/',
    //         layer: 'USGSShadedReliefOnly',
    //         style: 'default',
    //         format: 'image/jpeg',
    //         tileMatrixSetID: 'default028mm',
    //         maximumLevel: 19,
    //         credit: 'U. S. Geological Survey',
    //       },
    //     },
    //   ],
    //   baseVectorLayers: [],
    // },
  ],
};

const EllipsoidProvider = new EllipsoidTerrainProvider({});

const CesiumProvider = new CesiumTerrainProvider({
  url: new Resource({
    url: 'https://assets.cesium.com/1',
    headers: {
      authorization:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjNmExMzdjMC1iYzYwLTQ3Y2EtYjc2Yy05Y2FkZjFiNzBhYjEiLCJpZCI6MjU5LCJhc3NldHMiOnsiMSI6eyJ0eXBlIjoiVEVSUkFJTiIsImV4dGVuc2lvbnMiOlt0cnVlLHRydWUsdHJ1ZV0sInB1bGxBcGFydFRlcnJhaW4iOmZhbHNlfX0sInNyYyI6Ijc4NmQwNDM5LTdkYmMtNDNlZS1iOWZjLThmYzljZTA3M2EyZiIsImlhdCI6MTY0MTM2NTkwNywiZXhwIjoxNjQxMzY5NTA3fQ.u5Tcvmy31j78oSYgKh7h3Tw_Bf1vm2e-06o8dClMigA',
    },
  }),
});

const VRTheWorldProvider = new VRTheWorldTerrainProvider({
  url: 'http://www.vr-theworld.com/vr-theworld/tiles1.0.0/73/',
});

const ArcGisProvider = new ArcGISTiledElevationTerrainProvider({
  url:
    'https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer',
});

const QuantizedMeshProvider = new QuantizedMeshTerrainProvider({
  getUrl: (x: number, y: number, level: number): string => {
    // const tilingScheme = new WebMercatorTilingScheme(); // {ellipsoid: Ellipsoid.WGS84}
    const tilingScheme = new GeographicTilingScheme({
      numberOfLevelZeroTilesX: 2,
      numberOfLevelZeroTilesY: 1,
      ellipsoid: Ellipsoid.WGS84,
    });
    const column = x;
    const row = tilingScheme.getNumberOfYTilesAtLevel(level) - y - 1;

    return `/mock/terrain_example_tiles/${level}/${column}/${row}.terrain`;
    // return `https://assets.cesium.com/1/${level}/${column}/${row}.terrain?extensions=octvertexnormals-watermask-metadata&v=1.2.0`;
  },
  credit: `Mapcolonies`,
});

const terrainProviderList = [
  {
    id: 'NONE',
    value: EllipsoidProvider,
  },
  {
    id: 'Cesium Terrain Provider',
    value: CesiumProvider,
  },
  {
    id: 'V R The World Terrain Provider',
    value: VRTheWorldProvider,
  },
  {
    id: 'Arc Gis Terrain Provider',
    value: ArcGisProvider,
  },
  {
    id: 'Custom Terrain Provider',
    value: QuantizedMeshProvider,
  },
];

interface ITerrainProviderItem {
  id: string;
  value: TerrainProvider | undefined;
}

interface ITerrainProviderSelectorProps {
  terrainProviderList: ITerrainProviderItem[];
}

const TerrainProviderSelector: React.FC<ITerrainProviderSelectorProps> = ({
  terrainProviderList,
}) => {
  const mapViewer = useCesiumMap();

  return (
    <select
      defaultValue={terrainProviderList[0].id}
      onChange={(evt): void => {
        const selected = terrainProviderList.find(
          (item) => item.id === evt.target.value
        );
        mapViewer.terrainProvider = (selected as ITerrainProviderItem)
          .value as TerrainProvider;
      }}
    >
      {terrainProviderList.map((provider) => {
        return <option key={provider.id}>{provider.id}</option>;
      })}
    </select>
  );
};

export const QuantizedMesh: Story = () => {
  // const [center] = useState<[number, number]>([24, -200]);
  const [center] = useState<[number, number]>([-122, 43]);
  return (
    <div style={mapDivStyle}>
      <CesiumMap
        center={center}
        zoom={5}
        imageryProvider={false}
        sceneModes={[CesiumSceneMode.SCENE3D, CesiumSceneMode.COLUMBUS_VIEW]}
        baseMaps={BASE_MAPS}
        mapProjection={new WebMercatorProjection()} // Ellipsoid.WGS84
      >
        <Cesium3DTileset
          isZoomTo={true}
          url="/mock/Rehovot_solar_tileset/L16_31023/L16_31023.json"
        />
        <TerrainProviderSelector terrainProviderList={terrainProviderList} />
      </CesiumMap>
    </div>
  );
};
// QuantizedMesh.storyName = 'Quantized Map';