import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from 'react';
import { Viewer, CesiumComponentRef } from 'resium';
import { ViewerProps } from 'resium/dist/types/src/Viewer/Viewer';
import { Viewer as CesiumViewer, Cartesian3 } from 'cesium';
import { isNumber, isArray } from 'lodash';

import { getAltitude } from '../utils/map';
import { Box } from '../box';
import './map.css';
import { CoordinatesTrackerTool } from './tools/coordinates-tracker.tool';
import { ScaleTrackerTool } from './tools/scale-tracker.tool';
import { Proj } from '.';

const mapContext = createContext<CesiumViewer | null>(null);
const MapViewProvider = mapContext.Provider;

export interface CesiumMapProps extends ViewerProps {
  showMousePosition?: boolean;
  showScale?: boolean;
  projection?: Proj;
  center?: [number, number];
  zoom?: number;
  locale?: { [key: string]: string };
}

export const useCesiumMap = (): CesiumViewer => {
  const mapViewer = useContext(mapContext);

  if (mapViewer === null) {
    throw new Error('map context is null, please check the provider');
  }

  return mapViewer;
};

export const CesiumMap: React.FC<CesiumMapProps> = (props) => {
  const ref = useRef<CesiumComponentRef<CesiumViewer>>(null);
  const [mapViewRef, setMapViewRef] = useState<CesiumViewer>();
  const [projection, setProjection] = useState<Proj>();
  const [showMousePosition, setShowMousePosition] = useState<boolean>();
  const [showScale, setShowScale] = useState<boolean>();
  const [locale, setLocale] = useState<{ [key: string]: string }>();

  const viewerProps = {
    fullscreenButton: true,
    timeline: false,
    animation: false,
    baseLayerPicker: false,
    geocoder: false,
    navigationHelpButton: false,
    homeButton: false,
    ...(props as ViewerProps),
  };

  useEffect(() => {
    setMapViewRef(ref.current?.cesiumElement);
  }, [ref]);

  useEffect(() => {
    setProjection(props.projection ?? Proj.WGS84);
  }, [props.projection]);

  useEffect(() => {
    setLocale(props.locale);
  }, [props.locale]);

  useEffect(() => {
    setShowMousePosition(props.showMousePosition ?? true);
  }, [props.showMousePosition]);

  useEffect(() => {
    setShowScale(props.showScale ?? true);
  }, [props.showScale]);

  useEffect(() => {
    const zoom = props.zoom;
    const center = props.center;
    if (mapViewRef && isNumber(zoom) && isArray(center)) {
      void mapViewRef.camera.flyTo({
        destination: Cartesian3.fromDegrees(
          center[0],
          center[1],
          getAltitude(zoom)
        ),
        duration: 0,
      });
    }
  }, [props.zoom, props.center, mapViewRef]);

  return (
    <Viewer full ref={ref} {...viewerProps}>
      <MapViewProvider value={mapViewRef as CesiumViewer}>
        {props.children}
        <Box className="toolsContainer" display="flex">
          {showMousePosition === true ? (
            <CoordinatesTrackerTool
              projection={projection}
            ></CoordinatesTrackerTool>
          ) : (
            <></>
          )}
          {showScale === true ? <ScaleTrackerTool locale={locale} /> : <></>}
        </Box>
      </MapViewProvider>
    </Viewer>
  );
};
