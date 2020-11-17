import React, { createContext, useContext, useEffect, useState } from 'react';
import { Viewer } from 'resium';
import { Viewer as CesiumViewer } from "cesium";

import { CesiumComponentRef } from 'resium';
import { useRef } from 'react';

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

  return(
    <Viewer full ref={ref}>
      <MapViewProvider value={mapViewRef as CesiumViewer}>
        {props.children}
      </MapViewProvider>
  </Viewer>
  );
};
  