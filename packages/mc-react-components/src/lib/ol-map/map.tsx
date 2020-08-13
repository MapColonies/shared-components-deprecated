import React, {
  useRef,
  useEffect,
  createContext,
  useContext,
  useState,
} from "react";
import { Map as OlMap, View } from "ol";
import "./map.css";
import "ol/ol.css";

const mapContext = createContext<OlMap | null>(null);
const MapProvider = mapContext.Provider;

export const useMap = (): OlMap => {
  const map = useContext(mapContext);

  if (map === null) {
    throw new Error("map context is null, please check the provider");
  }

  return map;
};

export const Map: React.FC = (props) => {
  const CENTER_LAT = 35,
        CENTER_LON = 32;
  const mapElementRef = useRef<HTMLDivElement>(null);
  const [map] = useState(
    new OlMap({
      view: new View({
        center: [CENTER_LAT, CENTER_LON],
        zoom: 10,
        projection: "EPSG:4326",
      }),
    })
  );

  useEffect(() => {
    map.setTarget(mapElementRef.current as HTMLElement);
  }, [map]);

  return (
    <MapProvider value={map}>
      <div className="map" ref={mapElementRef}></div>
      {props.children}
    </MapProvider>
  );
};
