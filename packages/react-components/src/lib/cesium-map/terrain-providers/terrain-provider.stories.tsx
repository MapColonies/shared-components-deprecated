/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
  // Cesium3DTileset,
  // Cesium3DTile,
  // Cartographic,
  // Cartesian3,
  // defined,
  // sampleTerrainMostDetailed,
} from 'cesium';
import { Story, Meta } from '@storybook/react/types-6-0';
import { CesiumMap, useCesiumMap } from '../map';
import { CesiumSceneMode } from '../map.types';
import { Cesium3DTileset } from '../layers';
import QuantizedMeshTerrainProvider from './custom/quantized-mesh-terrain-provider';

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
    {
      id: '1st',
      title: '1st Map Title',
      isCurrent: true,
      thumbnail:
        'https://nsw.digitaltwin.terria.io/build/efa2f6c408eb790753a9b5fb2f3dc678.png',
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
    // const tilingScheme = new GeographicTilingScheme({
    //   numberOfLevelZeroTilesX: 2,
    //   numberOfLevelZeroTilesY: 1,
    //   ellipsoid: Ellipsoid.WGS84,
    // });
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
  const [depthTest, setDepthTest] = useState<boolean>(false);
  // const [tilesetUpdate, setTilesetUpdate] = useState<boolean>(false);

  const scene = mapViewer.scene;

  /*const tileset = scene.primitives.add(
    new Cesium3DTileset({
      url: '/mock/tileset_2/L16_31023/L16_31023.json',
    })
  );*/

  const handleDepthTestChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setDepthTest(e.target.checked);
    scene.globe.depthTestAgainstTerrain = !depthTest;
  };

  /*const updateTile = (tile: Cesium3DTile): void => {
    const boundingVolume = tile.boundingVolume;
    if (defined(tile.contentBoundingVolume)) {
      boundingVolume = tile.contentBoundingVolume;
    }
    const content = tile.content;
    const model = content._model;
    const height = boundingVolume.minimumHeight;
    const center = model._rtcCenter;
    const normal = scene.globe.ellipsoid.geodeticSurfaceNormal(center, new Cartesian3());
    const offset = Cartesian3.multiplyByScalar(normal, height, new Cartesian3());
    const carto = Cartographic.fromCartesian(center);
    const promise = when.defer();
    if (scene.terrainProvider === ellipsoidTerrainProvider) {
      const result = carto;
      result.height = 0;
      promise.resolve(result);
    } else {
      promise = sampleTerrainMostDetailed(scene.terrainProvider, [carto]).then((results) => {
        const result = results[0];
        if (!defined(result)) {
          return carto;
        }
        return result;
      });
    }
    promise.then((result) => {
      result = Cartographic.toCartesian(result);
      const position = Cartesian3.subtract(result, offset, new Cartesian3());
      model._rtcCenter = Cartesian3.clone(position, model._rtcCenter);
    });
  };

  const updateTileset = (root: Cesium3DTile): void => {
    if (root.contentReady) {
      updateTile(root);
    } else {
      const listener = (tileset as Cesium3DTileset).tileLoad.addEventListener(
        (tile: Cesium3DTile) => {
          if (tile === root) {
            updateTile(tile);
            listener();
          }
        }
      );
    }
    const children = root.children;
    const length = children.length;
    for (let i = 0; i < length; ++i) {
      updateTileset(children[i]);
    }
  };

  const handleTilesetUpdate = (e: ChangeEvent<HTMLInputElement>): void => {
    setTilesetUpdate(e.target.checked);
    updateTileset((tileset as Cesium3DTileset).root);
  };*/

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
      {/* <br />
      <input
        type="checkbox"
        id="input"
        checked={tilesetUpdate}
        onChange={handleTilesetUpdate}
      />
      <label htmlFor="input">updateTileset</label> */}
    </>
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
          url="/mock/tileset_2/L16_31023/L16_31023.json"
        />
        <TerrainProviderSelector terrainProviderList={terrainProviderList} />
      </CesiumMap>
    </div>
  );
};
