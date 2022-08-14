/* eslint-disable @typescript-eslint/naming-convention */
import React, { useState } from 'react';
import {
  ArcGISTiledElevationTerrainProvider,
  EllipsoidTerrainProvider,
  // CesiumTerrainProvider,
  // Resource,
  TerrainProvider,
} from 'cesium';
import { Story, Meta } from '@storybook/react/types-6-0';
import { CesiumMap, CesiumViewer, useCesiumMap } from '../map';
import { CesiumSceneMode } from '../map.types';
import { InspectorTool } from '../tools/inspector.tool';
import { TerrainianHeightTool } from '../tools/terranian-height.tool';
import { Cesium3DTileset } from '../layers';
import { LayerType } from '../layers-manager';

export default {
  title: 'Cesium Map/QuantizedMesh',
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

const EllipsoidProvider = new EllipsoidTerrainProvider({});

//#region TILER MATERIALS
// const TTCesiumProviderSrtm30 = new CesiumTerrainProvider({
//   url: new Resource({
//     url: 'http://localhost:8002/srtm30',
//   }),
// });
// const TTCesiumProviderSrtm100 = new CesiumTerrainProvider({
//   url: new Resource({
//     url: 'http://localhost:8002/srtm100',
//   }),
// });
// const TTCesiumProviderMergedDescending = new CesiumTerrainProvider({
//   url: new Resource({
//     url: 'http://localhost:8002/mergedDescending',
//   }),
// });
//#endregion

//#region CTBD MATERIALS
// const CTBDCesiumProviderSrtm30 = new CesiumTerrainProvider({
//   url: new Resource({
//     url: 'http://localhost:3000/srtm30',
//   }),
// });
// const CTBDCesiumProviderSrtm100 = new CesiumTerrainProvider({
//   url: new Resource({
//     url: 'http://localhost:3000/srtm100',
//   }),
// });
// const CTBDCesiumProviderMergedAscending = new CesiumTerrainProvider({
//   url: new Resource({
//     url: 'http://localhost:3000/mergedAscending',
//   }),
// });
//#endregion

const ArcGisProvider = new ArcGISTiledElevationTerrainProvider({
  url:
    'https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer',
});

const terrainProviderListQmesh = [
  {
    id: 'NONE',
    value: EllipsoidProvider,
  },
  {
    id: 'Arc Gis Terrain Provider',
    value: ArcGisProvider,
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
  const mapViewer: CesiumViewer = useCesiumMap();

  return (
    <>
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
    </>
  );
};

export const QuantizedMeshHeightsTool: Story = () => {
  const [center] = useState<[number, number]>([34.817, 31.911]);
  return (
    <div style={mapDivStyle}>
      <CesiumMap
        center={center}
        zoom={5}
        imageryProvider={false}
        sceneModes={[CesiumSceneMode.SCENE3D, CesiumSceneMode.COLUMBUS_VIEW]}
        baseMaps={BASE_MAPS}
      >
        <Cesium3DTileset
          url="https://3d.ofek-air.com/3d/Jeru_Old_City_Cesium/ACT/Jeru_Old_City_Cesium_ACT.json"
          isZoomTo={true}
        />
        <TerrainProviderSelector
          terrainProviderList={terrainProviderListQmesh}
        />
        <TerrainianHeightTool />
        <InspectorTool />
      </CesiumMap>
    </div>
  );
};
QuantizedMeshHeightsTool.storyName = 'Heights Tool';
