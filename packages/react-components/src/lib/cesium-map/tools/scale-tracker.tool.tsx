import React, { useEffect, useRef, useState } from 'react';
import { Viewer, Math as CesiumMath, Cartesian2, EllipsoidGeodesic } from 'cesium';
import { isNumber } from 'lodash'; 
import { useMap } from '../map';

import './scale-tracker.tool.css';

export interface RScaleTrackerToolProps {}

export const ScaleTrackerTool: React.FC<RScaleTrackerToolProps> = (props) => {
  const mapViewer: Viewer = useMap();
  const ref = useRef<HTMLDivElement>(null);
  const [scaleData, setScaleData] = useState();

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
    const viewModel = {
      barWidth: undefined,
      distanceLabel: undefined
    }
    const geodesic = new EllipsoidGeodesic();
    // if (!viewModel.enableDistanceLegend) {
    //   viewModel.barWidth = undefined;
    //   viewModel.distanceLabel = undefined;
    //   return;
    // }
    // var now = getTimestamp();
    // if (now < viewModel._lastLegendUpdate + 250) {
    //   return;
    // }

    // viewModel._lastLegendUpdate = now;

    // Find the distance between two pixels at the bottom center of the screen.
    var width = mapViewer.scene.canvas.clientWidth;
    var height = mapViewer.scene.canvas.clientHeight;

    var left = mapViewer.scene.camera.getPickRay(
      new Cartesian2((width / 2) | 0, height - 1)
    );
    var right = mapViewer.scene.camera.getPickRay(
      new Cartesian2((1 + width / 2) | 0, height - 1)
    );

    var globe = mapViewer.scene.globe;
    var leftPosition = globe.pick(left, mapViewer.scene);
    var rightPosition = globe.pick(right, mapViewer.scene);

    if (!leftPosition || !rightPosition) {
      viewModel.barWidth = undefined;
      viewModel.distanceLabel = undefined;
      return;
    }

    var leftCartographic = globe.ellipsoid.cartesianToCartographic(
      leftPosition
    );
    var rightCartographic = globe.ellipsoid.cartesianToCartographic(
      rightPosition
    );

    geodesic.setEndPoints(leftCartographic, rightCartographic);
    var pixelDistance = geodesic.surfaceDistance;

    // Find the first distance that makes the scale bar less than 100 pixels.
    var maxBarWidth = 100;
    var distance;
    for (var i = distances.length - 1; !isNumber(distance) && i >= 0; --i) {
      if (distances[i] / pixelDistance < maxBarWidth) {
        distance = distances[i];
      }
    }

    if (isNumber(distance)) {
      var label;
      if (distance >= 1000) {
        label = (distance / 1000).toString() + ' km';
      } else {
        label = distance.toString() + ' m';
      }

      viewModel.barWidth = (distance / pixelDistance) | 0;
      viewModel.distanceLabel = label;
    } else {
      viewModel.barWidth = undefined;
      viewModel.distanceLabel = undefined;
    }

    setScaleData(viewModel);
    console.log('viewModel-->', viewModel);
  };

  useEffect(() => {
    const setFromEvent = (e: MouseEvent): void => {
      updateDistanceLegendCesium();
      const heading = Math.round(
        CesiumMath.toDegrees(mapViewer.camera.heading)
      );
      console.log('Heading:', heading);

      const pitch = Math.round(CesiumMath.toDegrees(mapViewer.camera.pitch));
      console.log('Pitch:', pitch);
    };
    mapViewer.camera.moveEnd.addEventListener(setFromEvent);
    // mapViewer.camera.changed.addEventListener(setFromEvent);

    return (): void => {
      // mapViewer.camera.changed.removeEventListener(setFromEvent);
      mapViewer.camera.moveEnd.removeEventListener(setFromEvent);
    };
  }, [ref, mapViewer]);

  // return <div className="trackerPosition" ref={ref}></div>;

  return (scaleData ? (<div className="scalePosition" ref={ref}>
    <div className="distance-legend-label">{scaleData?.distanceLabel}</div>
    <div className="distance-legend-scale-bar" style={{
      height: '2px',
      width: scaleData?.barWidth + 'px', 
      left: (5 + (125 - scaleData?.barWidth) / 2) + 'px' 
    }}>
    </div>
  </div>) : null);
};
