import React, { createContext, useContext, useEffect, useState } from 'react';
import { Viewer } from 'resium';
import { Viewer as CesiumViewer, Cartesian3 } from "cesium";
import { isNumber, isArray } from 'lodash'; 

import { CesiumComponentRef } from 'resium';
import { useRef } from 'react';
import { getAltitude } from '../utils/map';
import { Box } from '../box';
import './map.css';
import { CoordinatesTrackerTool } from './tools/coordinates-tracker.tool';
import { ScaleTrackerTool } from './tools/scale-tracker.tool';
import { Proj } from '.';

const mapContext = createContext<CesiumViewer | null>(null);
const MapViewProvider = mapContext.Provider;

export interface MapProps {
  allowFullScreen?: boolean;
  showMousePosition?: boolean;
  showScale?: boolean;
  projection?: Proj;
  center?: [number, number];
  zoom?: number;
}

export const useMap = (): CesiumViewer => {
  const mapViewer = useContext(mapContext);

  if (mapViewer === null) {
    throw new Error('map context is null, please check the provider');
  }

  return mapViewer;
};

export const CesiumMap: React.FC<MapProps> = (props) => {
  const ref = useRef<CesiumComponentRef<CesiumViewer>>(null);
  const [mapViewRef, setMapViewRef] = useState<CesiumViewer>();
  const [projection, setProjection] = useState<Proj>();
  const [showMousePosition, setShowMousePosition] = useState<boolean>();
  const [showScale, setShowScale] = useState<boolean>();
  
  
  useEffect(() => {
    setMapViewRef(ref.current?.cesiumElement);
  }, [ref]);

  useEffect(() => {
    setProjection(props.projection ?? Proj.WGS84);
  }, [props.projection]);


  useEffect(() => {
    setShowMousePosition(props.showMousePosition ?? true);
  }, [props.showMousePosition]);

  useEffect(() => {
    setShowScale(props.showScale ?? true);
  }, [props.showScale]);

  useEffect(() => {
    const { zoom, center } = props;
    if (mapViewRef && isNumber(zoom) && isArray(center)) {
      void mapViewRef.camera.flyTo({
        destination: Cartesian3.fromDegrees(center[0], center[1], getAltitude(zoom)),
        duration: 0,
      });
    }
  }, [props, mapViewRef]);

  return(
    <Viewer full={props.allowFullScreen ?? true} ref={ref} 
      timeline={false}
      animation={false}
      baseLayerPicker={false}
      geocoder={false}
      navigationHelpButton={false}
      homeButton={false}
    >
      <MapViewProvider value={mapViewRef as CesiumViewer}>
        {props.children}
        <Box className="toolsContainer" display="flex">
          {
            (showMousePosition === true) ? 
              <CoordinatesTrackerTool projection={projection}></CoordinatesTrackerTool>
              :
              <></>
          }
          {
            (showScale === true) ? <ScaleTrackerTool/> : <></>
          }
       </Box>
      </MapViewProvider>
  </Viewer>
  );
};
  