import React, { useEffect, useRef, useState } from 'react';
import {
  Cartesian3,
  Math as CesiumMath,
  WebMercatorProjection,
  ScreenSpaceEventType,
} from 'cesium';
import { CesiumViewer, useCesiumMap } from '../map';

import './coordinates-tracker.tool.css';
import {
  Proj,
  COORDINATES_WGS_FRACTION_DIGITS,
  COORDINATES_MERCATOR_FRACTION_DIGITS,
} from '../../utils/projections';

export interface RCoordinatesTrackerToolProps {
  projection?: Proj;
}

export const CoordinatesTrackerTool: React.FC<RCoordinatesTrackerToolProps> = (
  props
) => {
  const mapViewer: CesiumViewer = useCesiumMap();
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    mapViewer.screenSpaceEventHandler.setInputAction(
      (evt?: Record<string, unknown>) => {
        if (evt?.endPosition) {
          setPosition({ ...(evt.endPosition as { x: number; y: number }) } as {
            x: number;
            y: number;
          });
        }
      },
      ScreenSpaceEventType.MOUSE_MOVE
    );
  }, [ref, mapViewer]);

  useEffect(() => {
    const ellipsoid = mapViewer.scene.globe.ellipsoid;
    // Mouse over the globe to see the cartographic position
    const cartesian = mapViewer.camera.pickEllipsoid(
      new Cartesian3(position.x, position.y),
      ellipsoid
    );

    if (cartesian) {
      const cartographic = ellipsoid.cartesianToCartographic(cartesian);
      if (ref.current) {
        let coordinatesText = '';
        switch (props.projection) {
          case Proj.WEB_MERCATOR: {
            const wmProjection = new WebMercatorProjection(ellipsoid);
            const res = wmProjection.project(cartographic);
            coordinatesText = `Mercator: ${res.y.toFixed(
              COORDINATES_MERCATOR_FRACTION_DIGITS
            )}m, ${res.x.toFixed(COORDINATES_MERCATOR_FRACTION_DIGITS)}m`;
            ref.current.style.width = '220px';
            break;
          }
          case Proj.WGS84: {
            const longitudeString = CesiumMath.toDegrees(
              cartographic.longitude
            ).toFixed(COORDINATES_WGS_FRACTION_DIGITS);
            const latitudeString = CesiumMath.toDegrees(
              cartographic.latitude
            ).toFixed(COORDINATES_WGS_FRACTION_DIGITS);

            coordinatesText = `WGS84: ${latitudeString}°N ${longitudeString}°E`;
            ref.current.style.width = '200px';
            break;
          }
          default:
            break;
        }
        ref.current.innerHTML = coordinatesText;
      }
    }
  }, [position, ref, mapViewer, props.projection]);

  return <div className="trackerPosition" ref={ref}></div>;
};
