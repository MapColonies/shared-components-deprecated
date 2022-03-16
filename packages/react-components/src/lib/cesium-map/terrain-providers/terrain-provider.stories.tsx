import React, { ChangeEvent, useState } from 'react';
import {
  ArcGISTiledElevationTerrainProvider,
  EllipsoidTerrainProvider,
  TerrainProvider,
  VRTheWorldTerrainProvider,
  WebMercatorProjection,
  CesiumTerrainProvider,
  Resource,
  WebMercatorTilingScheme,
} from 'cesium';
import { Story, Meta } from '@storybook/react/types-6-0';
import { CesiumMap, useCesiumMap } from '../map';
import { CesiumSceneMode } from '../map.types';
import { Cesium3DTileset } from '../layers';
import { LayerType } from '../layers-manager';
import { InspectorTool } from '../tools/inspector.tool';
import QuantizedMeshTerrainProvider from './custom/quantized-mesh-terrain-provider';

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

const CesiumProvider = new CesiumTerrainProvider({
  url: new Resource({
    url: 'https://my-assets.cesium.com/1',
    headers: {
      authorization: 'Bearer <my-access-token>',
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
    const tilingScheme = new WebMercatorTilingScheme();
    const column = x;
    const row = tilingScheme.getNumberOfYTilesAtLevel(level) - y - 1;

    return `/mock/terrain_example_tiles/${level}/${column}/${row}.terrain`;
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
    id: 'V R The World Terrain Provider (Hight Map)',
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
  const [depthTest, setDepthTest] = useState<boolean>(false);
  const mapViewer = useCesiumMap();

  const scene = mapViewer.scene;

  const handleDepthTestChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setDepthTest(e.target.checked);
    scene.globe.depthTestAgainstTerrain = !depthTest;
  };

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
      <br />
      <input
        type="checkbox"
        id="input"
        checked={depthTest}
        onChange={handleDepthTestChange}
      />
      <label htmlFor="input">depthTestAgainstTerrain</label>
    </>
  );
};

export const QuantizedMeshProviders: Story = () => {
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
        mapProjection={new WebMercatorProjection()}
      >
        <Cesium3DTileset
          isZoomTo={true}
          url="/mock/tileset_2/L16_31023/L16_31023.json"
        />
        <TerrainProviderSelector terrainProviderList={terrainProviderList} />
        <InspectorTool />
      </CesiumMap>
    </div>
  );
};
QuantizedMeshProviders.storyName = 'Providers';
