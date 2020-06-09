import React, { useRef, useEffect, useState } from 'react';
import './ol-map.css'
import { Map, View, Feature } from 'ol';
import { Tile as TileLayer } from 'ol/layer'
import { OSM } from 'ol/source';
import { fromLonLat } from 'ol/proj';
import { Draw } from 'ol/interaction';
import GeometryType from "ol/geom/GeometryType";
import { GeoJSON } from 'ol/format'
import { createBox, DrawEvent, Options as DrawOptions } from 'ol/interaction/Draw';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { GeoJSONGeometry } from 'ol/format/GeoJSON';
import * as condition from 'ol/events/condition'

export enum DrawModes {
  box,
  polygon,
  none
}

export interface OlMapProps {
  onPolygonSelected?: (geom: GeoJSONGeometry) => void,
  drawMode: DrawModes,
  geom?: GeoJSONGeometry
};

const OlMap: React.FC<OlMapProps> = ({ onPolygonSelected, drawMode, geom }) => {
  const mapElementRef = useRef<HTMLDivElement>(null);
  // const mapRef = useRef<Map>();
  const [map, setMap] = useState<Map>();
  const [vectorSource, setVectorSource] = useState<VectorSource>();

  useEffect(() => {
    const source = new VectorSource();
    setVectorSource(source);

    const vector = new VectorLayer({
      source: source
    });

    const map = new Map({
      target: mapElementRef.current as HTMLElement,
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        vector
      ],
      view: new View({
        center: fromLonLat([35, 32]),
        zoom: 10
      })
    });
    console.log("creating map");

    setMap(map);
  }, [])

  useEffect(() => {
    if (geom) {
      vectorSource?.addFeature(new Feature(geom));

      return () => vectorSource?.clear();
    }
  }, [geom, vectorSource])

  useEffect(() => {
    const options: DrawOptions = { type: GeometryType.CIRCLE, source: vectorSource, condition: condition.always }
    switch (drawMode) {
      case DrawModes.none:
        return;
      case DrawModes.box:
        options.geometryFunction = createBox();
        break;
      case DrawModes.polygon:
        options.type = GeometryType.POLYGON;
        break;
    }

    const draw = new Draw(options);
    map?.addInteraction(draw)

    const onDrawEnd = (e: DrawEvent) => {
      const geoJson = new GeoJSON();
      const geom = geoJson.writeGeometryObject(e.feature.getGeometry())
      onPolygonSelected?.(geom);
    };

    draw.on('drawend', onDrawEnd);

    return (() => {
      draw.un('drawend', onDrawEnd);
      map?.removeInteraction(draw);
    });
  }, [onPolygonSelected, drawMode, map])

  return (<div className="map" ref={mapElementRef}></div>)
}

export default OlMap;
