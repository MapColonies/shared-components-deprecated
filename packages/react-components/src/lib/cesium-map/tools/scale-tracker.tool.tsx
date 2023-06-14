import React, { useEffect, useState } from 'react';
import { Cartesian2, EllipsoidGeodesic, EventHelper, Ray } from 'cesium';
import { isNumber, get } from 'lodash';
import { CesiumViewer, useCesiumMap } from '../map';

import './scale-tracker.tool.css';

export interface RScaleTrackerToolProps {
  locale?: { [key: string]: string };
}

interface IScaleData {
  barWidth?: number;
  distanceLabel?: string;
  lastLegendUpdate: number;
}

/* eslint-disable @typescript-eslint/no-magic-numbers */
const distances = [
  1,
  2,
  3,
  5,
  10,
  20,
  30,
  50,
  100,
  200,
  300,
  500,
  1000,
  2000,
  3000,
  5000,
  10000,
  20000,
  30000,
  50000,
  100000,
  200000,
  300000,
  500000,
  1000000,
  2000000,
  3000000,
  5000000,
  10000000,
  20000000,
  30000000,
  50000000,
];

const updateDistanceLegendCesium = (
  mapViewer: CesiumViewer,
  prevScaleData: IScaleData,
  setScaleData: React.Dispatch<React.SetStateAction<IScaleData>>,
  locale?: { [key: string]: string }
): void => {
  const metersUnit = get(locale, 'METERS_UNIT') ?? 'm';
  const kiloMetersUnit = get(locale, 'KILOMETERS_UNIT') ?? 'km';
  const scale: IScaleData = {
    barWidth: undefined,
    distanceLabel: undefined,
    lastLegendUpdate: prevScaleData.lastLegendUpdate,
  };
  const geodesic = new EllipsoidGeodesic();

  const now = new Date().getTime();
  if (now < scale.lastLegendUpdate + 250) {
    return;
  }

  scale.lastLegendUpdate = now;

  // Find the distance between two pixels at the bottom center of the screen.
  const width = mapViewer.scene.canvas.clientWidth;
  const height = mapViewer.scene.canvas.clientHeight;

  const left = mapViewer.scene.camera.getPickRay(
    new Cartesian2((width / 2) | 0, height - 1)
  );
  const right = mapViewer.scene.camera.getPickRay(
    new Cartesian2((1 + width / 2) | 0, height - 1)
  );

  const globe = mapViewer.scene.globe;
  const leftPosition = globe.pick(left as Ray, mapViewer.scene);
  const rightPosition = globe.pick(right as Ray, mapViewer.scene);

  if (!leftPosition || !rightPosition) {
    return;
  }

  const leftCartographic = globe.ellipsoid.cartesianToCartographic(
    leftPosition
  );
  const rightCartographic = globe.ellipsoid.cartesianToCartographic(
    rightPosition
  );

  geodesic.setEndPoints(leftCartographic, rightCartographic);
  const pixelDistance = geodesic.surfaceDistance;

  // Find the first distance that makes the scale bar less than 100 pixels.
  const maxBarWidth = 100;
  let distance;
  for (let i = distances.length - 1; !isNumber(distance) && i >= 0; --i) {
    if (distances[i] / pixelDistance < maxBarWidth) {
      distance = distances[i];
    }
  }

  if (isNumber(distance)) {
    let label = '';
    if (distance >= 1000) {
      label = `${(distance / 1000).toString()} ${kiloMetersUnit}`;
    } else {
      label = `${distance.toString()} ${metersUnit}`;
    }

    scale.barWidth = (distance / pixelDistance) | 0;
    scale.distanceLabel = label;
  }

  setScaleData(scale);
};
/* eslint-enable @typescript-eslint/no-magic-numbers */

export const ScaleTrackerTool: React.FC<RScaleTrackerToolProps> = (props) => {
  const mapViewer: CesiumViewer = useCesiumMap();
  const [scaleData, setScaleData] = useState<IScaleData>({
    barWidth: undefined,
    distanceLabel: undefined,
    lastLegendUpdate: -1,
  });

  useEffect(() => {
    const setFromEvent = (e: MouseEvent): void => {
      updateDistanceLegendCesium(
        mapViewer,
        scaleData,
        setScaleData,
        props.locale
      );
    };

    const helper = new EventHelper();
    const tileLoadHandler = (event: number): void => {
      if (mapViewer.scene.globe.tilesLoaded) {
        setFromEvent(new MouseEvent('mouse'));
        helper.removeAll();
      }
    };
    // Register tiles loader handler for initial load because globe.pick returning undefined
    // see here https://community.cesium.com/t/globe-pick-returning-undefined/6616
    helper.add(mapViewer.scene.globe.tileLoadProgressEvent, tileLoadHandler);

    mapViewer.camera.moveEnd.addEventListener(setFromEvent);

    return (): void => {
      try {
        /* eslint-disable @typescript-eslint/no-unnecessary-condition*/
        if (get(mapViewer, '_cesiumWidget') != undefined) {
          mapViewer.camera.moveEnd.removeEventListener(setFromEvent);
        }
      } catch (e) {
        console.log('CESIUM camera "moveEnd" remove listener failed', e);
      }
    };
  }, [mapViewer, props.locale, scaleData]);

  const calcLeft = (width: number): number => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    return 5 + (125 - width) / 2;
  };

  return (
    <div className="scalePosition">
      {isNumber(scaleData.barWidth) && (
        <>
          <div className="distance-legend-label">{scaleData.distanceLabel}</div>
          <div
            className="distance-legend-scale-bar"
            style={{
              height: '2px',
              width: `${scaleData.barWidth.toString()}px`,
              left: `${calcLeft(scaleData.barWidth).toString()}px`,
            }}
          />
        </>
      )}
    </div>
  );
};
