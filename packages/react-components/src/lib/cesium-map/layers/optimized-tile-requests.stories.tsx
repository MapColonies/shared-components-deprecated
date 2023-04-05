import React, { useCallback, useEffect, useState } from 'react';
import bbox from '@turf/bbox';
import { Story, Meta } from '@storybook/react/types-6-0';
import { Rectangle } from 'cesium';
import { CesiumMap, CesiumMapProps, useCesiumMap } from '../map';
import { CesiumSceneMode } from '../map.types';
import { IBaseMaps } from '../settings/settings';
import { CesiumXYZLayer } from './xyz.layer';

export default {
  title: 'Cesium Map',
  component: CesiumMap,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {},
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

const optionsRectXYZ = {
  url:
    'https://tiles.openaerialmap.org/5a831b4a2553e6000ce5ac80/0/d02ddc76-9c2e-4994-97d4-a623eb371456/{z}/{x}/{y}.png',
  footprint: {
    type: 'Polygon',
    coordinates: [
      [
        [34.8043847068541, 31.9023297972932],
        [34.8142791322292, 31.9023297972932],
        [34.8142791322292, 31.9108796531516],
        [34.8043847068541, 31.9108796531516],
        [34.8043847068541, 31.9023297972932],
      ],
    ],
  },
};

// Use Turf.js/bbox to calculate the bounding box from the supplied footprint.

const childLayerRect = Rectangle.fromDegrees(...bbox(optionsRectXYZ.footprint));

const mapDivStyle = {
  height: '100%',
  width: '100%',
  position: 'absolute' as const,
};

const mapViewProps: CesiumMapProps = {
  center: [34.811, 31.908],
  zoom: 14,
  imageryProvider: false,
  sceneModes: [CesiumSceneMode.SCENE3D, CesiumSceneMode.COLUMBUS_VIEW],
  baseMaps: BASE_MAPS as IBaseMaps,
  useOptimizedTileRequests: true,
};

interface LayerRelevancy {
  layerId?: string;
  isRelevant: boolean;
}

const RelevancyPresentor: React.FC = () => {
  const viewer = useCesiumMap();
  const [layersRelevancy, setLayersRelevancy] = useState<LayerRelevancy[]>([]);

  const updateLayerRelevancy = useCallback(() => {
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
  }, [viewer.layersManager]);

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
        }}
      >
        {layersRelevancy.map((layer) => {
          return (
            <div>
              <p>Layer Id: {layer.layerId ?? 'Discrete Layer'}</p>
              <p>Requesting tiles: {layer.isRelevant.toString()}</p>
            </div>
          );
        })}
      </div>
    </>
  );
};

export const OptimizedTileRequestingMap: Story<CesiumMapProps> = (args) => (
  <div style={mapDivStyle}>
    <CesiumMap {...mapViewProps} {...args}>
      <CesiumXYZLayer rectangle={childLayerRect} options={optionsRectXYZ} />
      <RelevancyPresentor />
    </CesiumMap>
  </div>
);
OptimizedTileRequestingMap.storyName = 'Optimized Tile Requesting';
