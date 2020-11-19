import React, { createContext, useContext, useEffect, useState } from 'react';
import { Viewer } from 'resium';
import { Viewer as CesiumViewer, Cartesian3 } from "cesium";
import { isNumber, isArray } from 'lodash'; 

import { CesiumComponentRef } from 'resium';
import { useRef } from 'react';
import { getAltitude } from '../utils/map';
import './map.css';

const mapContext = createContext<CesiumViewer | null>(null);
const MapViewProvider = mapContext.Provider;

export interface MapProps {
  allowFullScreen?: boolean;
  showMousePosition?: boolean;
  // projection?: Proj;
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
  
  useEffect(() => {
    setMapViewRef(ref.current?.cesiumElement);
  }, [ref]);

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
    <Viewer full ref={ref} 
      timeline={false}
      animation={false}
      baseLayerPicker={false}
      geocoder={false}
      navigationHelpButton={false}
      homeButton={false}
    >
      <MapViewProvider value={mapViewRef as CesiumViewer}>
        {props.children}
      </MapViewProvider>
  </Viewer>
  );
};
  