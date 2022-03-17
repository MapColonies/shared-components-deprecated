import React, { ChangeEvent, useEffect, useState } from 'react';
import {
  ArcGISTiledElevationTerrainProvider,
  EllipsoidTerrainProvider,
  Cesium3DTileset,
  CesiumTerrainProvider,
  Resource,
  TerrainProvider,
} from 'cesium';
import { Story, Meta } from '@storybook/react/types-6-0';
import { CesiumMap, useCesiumMap } from '../map';
import { CesiumSceneMode } from '../map.types';
import { InspectorTool } from '../tools/inspector.tool';
import { TerrainianHeightTool } from '../tools/terranian-height.tool';
import { LayerType } from '../layers-manager';
import { update } from '../layers/3d.tileset.update';

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

// eslint-disable-next-line @typescript-eslint/naming-convention
const MCCesiumProviderMercator = new CesiumTerrainProvider({
  url: new Resource({
    url: 'http://localhost:8002/WorldTerrain',
  }),
});

// eslint-disable-next-line @typescript-eslint/naming-convention
const MCCesiumProviderW84 = new CesiumTerrainProvider({
  url: new Resource({
    url: 'http://localhost:3000',
  }),
});

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
    id: 'Terrain-Tiler',
    value: MCCesiumProviderMercator,
  },
  {
    id: 'CTBD',
    value: MCCesiumProviderW84,
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
  const [depthTest, setDepthTest] = useState<boolean>(false);
  const [handleUpdateTileset, setHandleUpdateTileset] = useState<boolean>(
    false
  );
  const [jerusalem] = useState<Cesium3DTileset>(
    new Cesium3DTileset({
      url:
        'https://3d.ofek-air.com/3d/Jeru_Old_City_Cesium/ACT/Jeru_Old_City_Cesium_ACT.json',
    })
  );
  const mapViewer = useCesiumMap();
  const scene = mapViewer.scene;
  let tileset: Cesium3DTileset;

  useEffect(() => {
    // eslint-disable-next-line
    tileset = scene.primitives.add(jerusalem);
    void mapViewer.zoomTo(tileset);
  }, []);

  const handleDepthTestChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setDepthTest(e.target.checked);
    scene.globe.depthTestAgainstTerrain = !depthTest;
  };

  const handleUpdateTilesetChange = (
    e: ChangeEvent<HTMLInputElement>
  ): void => {
    setHandleUpdateTileset(e.target.checked);
    if (!handleUpdateTileset) {
      // update(tileset);
    } else {
      // scene.primitives.remove(jerusalem);
      // eslint-disable-next-line
      tileset = scene.primitives.add(jerusalem);
    }
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
      <input
        type="checkbox"
        id="input"
        checked={depthTest}
        onChange={handleDepthTestChange}
        style={{ marginLeft: '20px', marginRight: '5px' }}
      />
      <label htmlFor="input">depthTestAgainstTerrain</label>
      <input
        type="checkbox"
        id="input"
        checked={handleUpdateTileset}
        onChange={handleUpdateTilesetChange}
        style={{ marginLeft: '20px', marginRight: '5px' }}
      />
      <label htmlFor="input">updateTileset</label>
      <br />
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
