import React, {
  ReactNode,
  useEffect,
  useState,
} from 'react';
import bbox from '@turf/bbox';
import { Story, Meta } from '@storybook/react/types-6-0';
import { Rectangle } from 'cesium';
import { CesiumMap, CesiumMapProps, useCesiumMap } from '../map';
import { CesiumSceneMode } from '../map.types';
import { IBaseMaps } from '../settings/settings';
import { CesiumXYZLayer } from './xyz.layer';

export default {
  title: 'Cesium Map/Map Optimizations',
  component: CesiumMap,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    useOptimizedTileRequests: true,
  },
  argTypes: {
    useOptimizedTileRequests: {
      description:
        'Should the viewer determine layer relevancy based on its visibility and presence in scene. (Improves bandwidth usage and overall performance)',
      table: {
        defaultValue: { summary: 'false' },
      },
      control: 'boolean',
    },
  },
} as Meta;

const BASE_MAPS = {
  maps: [
    {
      id: '3rd',
      title: '3rd Map Title',
      isCurrent: true,
      thumbnail:
        'https://nsw.digitaltwin.terria.io/build/d8b97d3e38a0d43e5a06dea9aae17a3e.png',
      baseRasteLayers: [
        {
          id: 'Opaque Base world wide layer',
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
          id: 'Transparent Base Roads world wide layer ',
          type: 'XYZ_LAYER',
          opacity: 1,
          zIndex: 1,
          options: {
            url: 'https://gps.tile.openstreetmap.org/lines/{z}/{x}/{y}.png',
            layers: '',
            credit: 'openstreetmap',
          },
        },
      ],
      baseVectorLayers: [],
    },
  ],
};

const mapDivStyle = {
  height: '100%',
  width: '100%',
  position: 'absolute' as const,
};

const mapViewProps: CesiumMapProps = {
  center: [-117.30644008676421, 33.117098433617564],
  zoom: 14,
  imageryProvider: false,
  sceneModes: [CesiumSceneMode.SCENE3D, CesiumSceneMode.COLUMBUS_VIEW],
  baseMaps: BASE_MAPS as IBaseMaps,
};

interface OptimizedTileRequestingMapStoryProps {
  useOptimizedTileRequests: boolean;
}

interface LayerRelevancy {
  layerId?: string;
  isRelevant?: boolean;
}

const RelevancyPresentor: React.FC<OptimizedTileRequestingMapStoryProps> = ({
  useOptimizedTileRequests,
}) => {
  const viewer = useCesiumMap();
  const [layersRelevancy, setLayersRelevancy] = useState<LayerRelevancy[]>([]);

  const updateLayerRelevancy = (): void => {
    if (viewer.layersManager?.layerList) {
      setLayersRelevancy(
        viewer.layersManager?.layerList
          .filter(
            (layer): boolean => layer.meta?.id !== 'TRANSPARENT_BASE_LAYER'
          )
          .map(
            (layer): LayerRelevancy => ({
              layerId: layer.meta?.id as string | undefined,
              isRelevant: layer.meta?.relevantToExtent as boolean,
            })
          )
      );
    }
  };

  useEffect(() => {
    const removeTileLoad = viewer.scene.globe.tileLoadProgressEvent.addEventListener(
      (tilesLoadingCount) => {
        if (tilesLoadingCount === 0) {
          updateLayerRelevancy();
          removeTileLoad();
        }
      }
    );

    const removeMoveEnd = viewer.camera.moveEnd.addEventListener(() => {
      updateLayerRelevancy();
    });

    return (): void => {
      removeMoveEnd();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          zIndex: 999,
          background: 'white',
          padding: '20px',
          fontFamily: 'Helvetica',
          minWidth: '200px',
          minHeight: '200px',
        }}
      >
        <h3>
          Optimized Tile Requesting: {useOptimizedTileRequests ? 'enabled' : 'disabled'}
        </h3>
        {layersRelevancy.map((layer) => {
          return (
            <div>
              <p>Layer Id: {layer.layerId}</p>
              <p>Requesting tiles: {layer.isRelevant?.toString()}</p>
            </div>
          );
        })}
      </div>
    </>
  );
};

const LayersContainer: React.FC = () => {
  const [layer, setLayer] = useState<ReactNode>(null);
  const btnStyle = {
    position: 'absolute',
    top: 50,
    left: '50%',
    zIndex: 1000,
    transform: 'translate(0, -50%)',
  } as React.CSSProperties;

  const optionsXYZTransparency = {
    url:
      'https://tiles.openaerialmap.org/5d73614588556200055f10d6/0/5d73614588556200055f10d7/{z}/{x}/{y}',
    footprint:  {
     coordinates: [
        [
          [
            -117.30976118375267,
            33.116454006568205
          ],
          [
            -117.30976118375267,
            33.11330462707964
          ],
          [
            -117.30513526140776,
            33.11330462707964
          ],
          [
            -117.30513526140776,
            33.116454006568205
          ],
          [
            -117.30976118375267,
            33.116454006568205
          ]
        ]
      ],
      type: "Polygon"
    },
  };

  const optionsXYZOpaque = {
    // url:
    //   'https://tiles.openaerialmap.org/5a831b4a2553e6000ce5ac80/0/d02ddc76-9c2e-4994-97d4-a623eb371456/{z}/{x}/{y}.png',
    url:
      'http://stamen-tiles-b.a.ssl.fastly.net/toner/{z}/{x}/{y}.png',
    footprint: {
      coordinates: [
        [
          [
            -117.31921599064628,
            33.1210849388296
          ],
          [
            -117.31921599064628,
            33.1094152732627
          ],
          [
            -117.29986251692546,
            33.1094152732627
          ],
          [
            -117.29986251692546,
            33.1210849388296
          ],
          [
            -117.31921599064628,
            33.1210849388296
          ]
        ]
      ],
      type: "Polygon"
    },
  };

  return (
    <>
      <div
        className="buttonsContainer"
        style={{ display: 'flex', gap: '10px', ...btnStyle }}
      >
        <button
          onClick={(): void =>
            setLayer(
              <CesiumXYZLayer
                key="Transparent"
                meta={{ id: 'Transparent Layer', options: {...optionsXYZTransparency}}}
                rectangle={Rectangle.fromDegrees(
                  ...bbox(optionsXYZTransparency.footprint)
                )}
                options={optionsXYZTransparency}
              />
            )
          }
        >
          Layer With Transparency
        </button>

        <button
          onClick={(): void =>
            setLayer(
              <CesiumXYZLayer
                key="Opaque"
                meta={{ id: 'Opaque Layer', options: {...optionsXYZOpaque}}}
                rectangle={Rectangle.fromDegrees(
                  ...bbox(optionsXYZOpaque.footprint)
                )}
                options={optionsXYZOpaque}
              />
            )
          }
        >
          Opaque layer
        </button>
      </div>
      {layer}
    </>
  );
};

export const OptimizedTileRequestingMap: Story<OptimizedTileRequestingMapStoryProps> = (
  args
) => {
  return (
    <div style={mapDivStyle}>
      <CesiumMap
        {...mapViewProps}
        useOptimizedTileRequests={args.useOptimizedTileRequests}
        key={args.useOptimizedTileRequests ? 'OPTIMIZED_MAP': 'REGULAR_MAP'}
      >
        <LayersContainer />
        <RelevancyPresentor
          useOptimizedTileRequests={args.useOptimizedTileRequests}
        />
      </CesiumMap>
    </div>
  );
};

OptimizedTileRequestingMap.storyName = 'Optimized Tile Requesting';
