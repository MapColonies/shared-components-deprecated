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
import { format, Coordinate } from 'ol/coordinate';
import { defaults as defaultControls, FullScreen } from 'ol/control';
import MousePosition from 'ol/control/MousePosition';
import Collection from 'ol/Collection';
import Control from 'ol/control/Control';
import { transform } from 'ol/proj';
import { Proj } from './projections';

export interface MapProps {
  allowFullScreen?: boolean;
  showMousePosition?: boolean;
  projection?: Proj;
}

const mapContext = createContext<OlMap | null>(null);
const MapProvider = mapContext.Provider;

const CENTER_LAT = 35,
  CENTER_LON = 32,
  DEFAULT_ZOOM = 10,
  COORDINATES_FRACTION_DIGITS = 5;

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
        center:
          projection !== undefined && projection !== Proj.WSG84
            ? transform([CENTER_LAT, CENTER_LON], Proj.WSG84, projection)
            : [CENTER_LAT, CENTER_LON],
        zoom: DEFAULT_ZOOM,
        projection: projection ?? Proj.WSG84,
      }),
      controls: defaultControls(),
    })
  );

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

    if (showMousePosition !== undefined && showMousePosition) {
      map.addControl(
        new MousePosition({
          coordinateFormat: (coord): string =>
            format(
              coord as Coordinate,
              '{y}°N {x}°E',
              COORDINATES_FRACTION_DIGITS
            ),
          projection: Proj.WSG84,
          undefinedHTML: '&nbsp;',
        })
      );
    } else {
      removeControl(MousePosition, map);
    }
  }, [map, allowFullScreen, showMousePosition]);

  return (
    <MapProvider value={map}>
      <div className="map" ref={mapElementRef}></div>
      {props.children}
    </MapProvider>
  );
};
