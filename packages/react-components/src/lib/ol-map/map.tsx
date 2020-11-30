import React, {
  useRef,
  useEffect,
  createContext,
  useContext,
  useState,
} from 'react';
import { Map as OlMap, View } from 'ol';
import './map.css';
import 'ol/ol.css';
import { format, Coordinate, CoordinateFormat } from 'ol/coordinate';
import { defaults as defaultControls, FullScreen } from 'ol/control';
import MousePosition from 'ol/control/MousePosition';
import Collection from 'ol/Collection';
import Control from 'ol/control/Control';
import { transform } from 'ol/proj';
import {
  Proj,
  COORDINATES_WGS_FRACTION_DIGITS,
  COORDINATES_MERCATOR_FRACTION_DIGITS,
} from '../utils/projections';

export interface MapProps {
  allowFullScreen?: boolean;
  showMousePosition?: boolean;
  projection?: Proj;
  center?: [number, number];
  zoom?: number;
}

const mapContext = createContext<OlMap | null>(null);
const MapProvider = mapContext.Provider;

const CENTER_LAT = 35,
  CENTER_LON = 32,
  DEFAULT_ZOOM = 10;

const getDefaultCenter = (projection: string | undefined): Coordinate => {
  return projection !== undefined && projection !== Proj.WGS84
    ? transform([CENTER_LAT, CENTER_LON], Proj.WGS84, projection)
    : [CENTER_LAT, CENTER_LON];
};

const getCoordinateFormatString = (projection?: Proj): CoordinateFormat => {
  switch (projection) {
    case Proj.WEB_MERCATOR:
      return (coord?: Coordinate): string =>
        format(
          coord as Coordinate,
          'Mercator: {y}m, {x}m',
          COORDINATES_MERCATOR_FRACTION_DIGITS
        );
    case Proj.WGS84:
      return (coord?: Coordinate): string =>
        format(
          coord as Coordinate,
          'WGS84: {y}°N {x}°E',
          COORDINATES_WGS_FRACTION_DIGITS
        );
    default:
      return (coord?: Coordinate): string => '';
  }
};

export const useMap = (): OlMap => {
  const map = useContext(mapContext);

  if (map === null) {
    throw new Error('map context is null, please check the provider');
  }

  return map;
};

export const Map: React.FC<MapProps> = (props) => {
  const mapElementRef = useRef<HTMLDivElement>(null);
  const { allowFullScreen, showMousePosition, projection } = props;

  const [map] = useState(
    new OlMap({
      view: new View({
        projection: projection ?? Proj.WGS84,
      }),
      controls: defaultControls(),
    })
  );

  useEffect(() => {
    map.getView().setCenter(props.center ?? getDefaultCenter(props.projection));
  }, [map, props.center, props.projection]);

  useEffect(() => {
    map.getView().setZoom(props.zoom ?? DEFAULT_ZOOM);
  }, [map, props.zoom, props.projection]);

  // eslint-disable-next-line
  const removeControl = (ctrType: any, mapInst: OlMap): void => {
    const controls: Collection<Control> = mapInst.getControls();
    controls.forEach((control: Control) => {
      if (control instanceof ctrType) {
        mapInst.removeControl(control);
      }
    });
  };

  useEffect(() => {
    map.setTarget(mapElementRef.current as HTMLElement);

    if (allowFullScreen !== undefined && allowFullScreen) {
      map.addControl(new FullScreen());
    } else {
      removeControl(FullScreen, map);
    }
  }, [map, allowFullScreen]);

  useEffect(() => {
    if (showMousePosition !== undefined && showMousePosition) {
      removeControl(MousePosition, map);
      map.addControl(
        new MousePosition({
          coordinateFormat: getCoordinateFormatString(projection ?? Proj.WGS84),
          projection: projection ?? Proj.WGS84,
          undefinedHTML: '&nbsp;',
        })
      );
    } else {
      removeControl(MousePosition, map);
    }
  }, [map, showMousePosition, projection]);

  return (
    <MapProvider value={map}>
      <div className="map" ref={mapElementRef}></div>
      {props.children}
    </MapProvider>
  );
};
