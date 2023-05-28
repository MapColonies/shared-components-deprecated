import React, { useEffect, useState } from 'react';
import { get } from 'lodash';
import { PerspectiveOffCenterFrustum } from 'cesium';
import { CesiumViewer, useCesiumMap } from '../map';
import { CesiumSceneMode } from '../map.types';

import './zoom_level-tracker.tool.css';

export interface RZoomLevelTrackerToolProps {
  locale?: { [key: string]: string };
}

/* eslint-disable @typescript-eslint/no-magic-numbers, @typescript-eslint/naming-convention, @typescript-eslint/no-unsafe-assignment,  @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
const detectZoomLevel = (distance: number, viewer: CesiumViewer) => {
  const MAX_ZOOM_LEVEL = 19;
  const tileProvider = get(viewer.scene.globe, '_surface.tileProvider') as any;
  const quadtree = tileProvider._quadtree;
  const drawingBufferHeight = viewer.canvas.height;
  const sseDenominator = get(viewer.camera.frustum, 'sseDenominator') ?? 1;

  for (let level = 0; level <= MAX_ZOOM_LEVEL; level++) {
    const maxGeometricError = tileProvider.getLevelMaximumGeometricError(level);
    const error =
      (maxGeometricError * drawingBufferHeight) / (distance * sseDenominator);
    if (error < quadtree.maximumScreenSpaceError) {
      return level;
    }
  }

  return null;
};

const getZoomLevelHeights = (precision: number, viewer: CesiumViewer) => {
  precision = precision || 10;

  const result = [];
  let step = 100000.0;
  let currentZoomLevel = 0;
  for (let height = 100000000.0; height > step; height = height - step) {
    const level = detectZoomLevel(height, viewer);
    if (level === null) {
      break;
    }

    if (level !== currentZoomLevel) {
      let minHeight = height;
      let maxHeight = height + step;
      while (maxHeight - minHeight > precision) {
        height = minHeight + (maxHeight - minHeight) / 2;
        if (detectZoomLevel(height, viewer) === level) {
          minHeight = height;
        } else {
          maxHeight = height;
        }
      }

      result.push({
        level: level,
        height: Math.round(height),
      });

      currentZoomLevel = level;

      if (result.length >= 2) {
        step = (result[result.length - 2].height - height) / 1000.0;
      }
    }
  }

  return result;
};
/* eslint-enable @typescript-eslint/no-magic-numbers */

export const ZoomLevelTrackerTool: React.FC<RZoomLevelTrackerToolProps> = (
  props
) => {
  const mapViewer: CesiumViewer = useCesiumMap();
  const [zoomLevel, setZoomLevel] = useState(1);
  const zoomLevelHeights = getZoomLevelHeights(1, mapViewer);

  useEffect(() => {
    const calculateZoomLevel = () => {
      const camera = mapViewer.camera;
      const ORTHOPHOTO_HEIGHT_FRUSTRUM_FACTOR = 0.5;
      let cameraHeight = 0;

      switch (mapViewer.scene.mode) {
        case CesiumSceneMode.SCENE3D:
          cameraHeight = mapViewer.scene.mapProjection.ellipsoid.cartesianToCartographic(
            camera.positionWC
          ).height;
          break;
        case CesiumSceneMode.SCENE2D:
          cameraHeight =
            ((camera.frustum as PerspectiveOffCenterFrustum).right -
              (camera.frustum as PerspectiveOffCenterFrustum).left) *
            ORTHOPHOTO_HEIGHT_FRUSTRUM_FACTOR;
          break;
        case CesiumSceneMode.COLUMBUS_VIEW:
          cameraHeight = camera.position.z;
          break;
        default:
          cameraHeight = 0;
          break;
      }

      if (zoomLevelHeights.length > 0) {
        const closestZoom = zoomLevelHeights.reduce((a, b) => {
          return Math.abs(b.height - cameraHeight) <
            Math.abs(a.height - cameraHeight)
            ? b
            : a;
        });

        setZoomLevel(closestZoom.level);
      }
    };

    mapViewer.camera.moveEnd.addEventListener(calculateZoomLevel);

    return (): void => {
      try {
        /* eslint-disable @typescript-eslint/no-unnecessary-condition*/
        if (get(mapViewer, '_cesiumWidget') != undefined) {
          mapViewer.camera.moveEnd.removeEventListener(calculateZoomLevel);
        }
      } catch (e) {
        console.log(
          'CESIUM camera "moveEnd"(from zoom tracker) remove listener failed',
          e
        );
      }
    };
  }, [mapViewer, zoomLevelHeights.length]);

  return (
    <div className="zoomLevel">
      <div className="zoomLevelValue">{zoomLevel}</div>
      <div className="zoomLevelLabel">
        {get(props.locale, 'ZOOM_LABEL') ?? 'zoom'}
      </div>
    </div>
  );
};
