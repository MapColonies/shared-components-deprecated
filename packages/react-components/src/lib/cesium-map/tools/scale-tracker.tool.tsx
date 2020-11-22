import React, { useEffect, useRef, useState } from 'react';
import { Viewer, Math as CesiumMath, Cartesian2, EllipsoidGeodesic, EventHelper } from 'cesium';
import { isNumber } from 'lodash'; 
import { useMap } from '../map';

import './scale-tracker.tool.css';

export interface RScaleTrackerToolProps {};

interface IScaleData {
  barWidth?: number,
  distanceLabel?: string,
  lastLegendUpdate: number,
}

export const ScaleTrackerTool: React.FC<RScaleTrackerToolProps> = (props) => {
  const mapViewer: Viewer = useMap();
  const [scaleData, setScaleData] = useState<IScaleData>({
    barWidth: undefined,
    distanceLabel: undefined,
    lastLegendUpdate: -1,

  });

  const distances = [
    1, 2, 3, 5,
    10, 20, 30, 50,
    100, 200, 300, 500,
    1000, 2000, 3000, 5000,
    10000, 20000, 30000, 50000,
    100000, 200000, 300000, 500000,
    1000000, 2000000, 3000000, 5000000,
    10000000, 20000000, 30000000, 50000000];

  const updateDistanceLegendCesium = () => {
    const scale: IScaleData = {
      barWidth: undefined,
      distanceLabel: undefined,
      lastLegendUpdate: scaleData.lastLegendUpdate,
    }
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
    const leftPosition = globe.pick(left, mapViewer.scene);
    const rightPosition = globe.pick(right, mapViewer.scene);

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
        label = (distance / 1000).toString() + ' km';
      } else {
        label = distance.toString() + ' m';
      }

      scale.barWidth = (distance / pixelDistance) | 0;
      scale.distanceLabel = label;
    }

    setScaleData(scale);
  };

  useEffect(() => {
    const setFromEvent = (e: MouseEvent): void => {
      updateDistanceLegendCesium();
    };

    const helper = new EventHelper();
    const tileLoadHandler = (event: number) => {
      // console.log("Tiles to load: " + event, mapViewer.scene.globe.tilesLoaded);
      if (mapViewer.scene.globe.tilesLoaded ) {
        setFromEvent(new MouseEvent('mouse'));
        helper.removeAll();
      }
    }
    // Register tiles loader handler for initial load because globe.pick returning undefined
    // see here https://community.cesium.com/t/globe-pick-returning-undefined/6616
    helper.add(mapViewer.scene.globe.tileLoadProgressEvent, tileLoadHandler);
    
    mapViewer.camera.moveEnd.addEventListener(setFromEvent);
    // mapViewer.camera.changed.addEventListener(setFromEvent);

    return (): void => {
      try{
        mapViewer.camera.moveEnd.removeEventListener(setFromEvent);
        // mapViewer.camera.changed.removeEventListener(setFromEvent);
      }
      catch(e){
        console.log('CESIUM camera "moveEnd" remove listener failed',e);
      }

    };
  }, [mapViewer]);

  // return <div className="trackerPosition" ref={ref}></div>;

  return <div className="scalePosition">
    {scaleData.distanceLabel && <div className="distance-legend-label">{scaleData.distanceLabel}</div>}
    {scaleData.barWidth && <div className="distance-legend-scale-bar" style={{
      height: '2px',
      width: scaleData.barWidth + 'px', 
      left: (5 + (125 - scaleData.barWidth) / 2) + 'px' 
    }}>
    </div>}
  </div>
};
