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
import { format } from "ol/coordinate";
import { defaults as defaultControls, FullScreen } from "ol/control";
import MousePosition from "ol/control/MousePosition";

export interface MapProps {
  allowFullScreen?: boolean;
  showMousePosition?: boolean;
}

const mapContext = createContext<OlMap | null>(null);
const MapProvider = mapContext.Provider;

const CENTER_LAT = 35,
  CENTER_LON = 32,
  PROJECTION = 'EPSG:4326',
  DEFAULT_ZOOM = 10,
  COORDINATES_FRACTION_DIFITS = 5;

export const useMap = (): OlMap => {
  const map = useContext(mapContext);

  if (map === null) {
    throw new Error('map context is null, please check the provider');
  }

  return map;
};

export const Map: React.FC<MapProps> = (props) => {
  const mapElementRef = useRef<HTMLDivElement>(null);
  const {allowFullScreen, showMousePosition} = props;
 
  const [map] = useState(
    new OlMap({
      view: new View({
        center: [CENTER_LAT, CENTER_LON],
        zoom: DEFAULT_ZOOM,
        projection: PROJECTION,
      }),
      controls: defaultControls()
    })
  );

  const removeControl = (ctrType: any, mapInst: any) => {
    mapInst.getControls().forEach((control: any) => {
      if (control instanceof ctrType) {
        mapInst.removeControl(control);
      }
    });
  };

  useEffect(() => {
    map.setTarget(mapElementRef.current as HTMLElement);
    
    if (allowFullScreen != undefined && allowFullScreen) {
      map.addControl(new FullScreen());
    }
    else{
      removeControl(FullScreen, map);
    }

    if (showMousePosition != undefined && showMousePosition) {
      map.addControl(
        new MousePosition({
          coordinateFormat: (coord:any)  => format(coord, '{y}°N {x}°E', COORDINATES_FRACTION_DIFITS),
          projection: PROJECTION,
          undefinedHTML: '&nbsp;',
        })
      );
    }
    else{
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
