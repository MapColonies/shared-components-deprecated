import React, { useEffect, useRef, useState } from 'react';
import { Cartesian3, Viewer, Math as CesiumMath, WebMercatorProjection } from 'cesium';
import { useMap } from '../map';

import './coordinates-tracker.tool.css';
import { Proj, COORDINATES_WGS_FRACTION_DIGITS, COORDINATES_MERCATOR_FRACTION_DIGITS  } from '..';


export interface RCoordinatesTrackerToolProps {
  projection?: Proj;
}

export const CoordinatesTrackerTool: React.FC<RCoordinatesTrackerToolProps> = (props) => {
  const mapViewer: Viewer = useMap();
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const setFromEvent = (e:MouseEvent): void => setPosition({ x: e.clientX, y: e.clientY });
    mapViewer.scene.canvas.addEventListener('mousemove', setFromEvent);

    return (): void => {
      try{
        mapViewer.scene.canvas.removeEventListener("mousemove", setFromEvent);
      }
      catch(e){
        console.log('CESIUM canvas "mousemove" remove listener failed',e);
      }
    };
  }, [ref, mapViewer]);

  useEffect(() => {
    const ellipsoid = mapViewer.scene.globe.ellipsoid;
    // Mouse over the globe to see the cartographic position 
    const cartesian = mapViewer.camera.pickEllipsoid(new Cartesian3(position.x, position.y), ellipsoid);
    if (cartesian) {
      const cartographic = ellipsoid.cartesianToCartographic(cartesian);
      if(ref.current){
        let coordinatesText='';
        switch(props.projection){
          case Proj.WEB_MERCATOR: {
            const wmProjection = new WebMercatorProjection(ellipsoid);
            const res = wmProjection.project(cartographic);
            coordinatesText = `Mercator: ${res.y.toFixed(COORDINATES_MERCATOR_FRACTION_DIGITS)}m, ${res.x.toFixed(COORDINATES_MERCATOR_FRACTION_DIGITS)}m`;
            break;
          }
          case Proj.WGS84: {
            const longitudeString = CesiumMath.toDegrees(cartographic.longitude).toFixed(COORDINATES_WGS_FRACTION_DIGITS);
            const latitudeString = CesiumMath.toDegrees(cartographic.latitude).toFixed(COORDINATES_WGS_FRACTION_DIGITS);
      
            coordinatesText = `WGS84: ${latitudeString}°N ${longitudeString}°E`;
            break;
          }
          default:
            break;
        }
        ref.current.innerHTML=coordinatesText;
      }
    }
  }, [position, ref, mapViewer, props.projection]);
  
  return (
    <div className="trackerPosition" ref={ref} >

    </div>
  );
};
