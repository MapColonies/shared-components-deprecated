import React, { useRef, useEffect, useState } from 'react';
import './ol-map.css'
import { Map, View, Feature } from 'ol';
import { Tile as TileLayer } from 'ol/layer'
import { OSM } from 'ol/source';
import { Draw } from 'ol/interaction';
import GeometryType from "ol/geom/GeometryType";
import { GeoJSON } from 'ol/format'
import { createBox, DrawEvent, Options as DrawOptions } from 'ol/interaction/Draw';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import * as condition from 'ol/events/condition'
import { observer } from 'mobx-react-lite';
import { useMst } from '../models/Root';
import { Geometry } from '@turf/helpers';

export enum DrawModes {
  box,
  polygon,
  none
}

export interface OlMapProps {
  onPolygonSelected?: (geom: Geometry) => void,
  drawMode: DrawModes,
  geom?: Geometry
};

const OlMap: React.FC<OlMapProps> = observer(({ onPolygonSelected, drawMode, geom }) => {
  const mapElementRef = useRef<HTMLDivElement>(null);
  // const mapRef = useRef<Map>();
  const [map, setMap] = useState<Map>();
  const [selectionVectorSource, setSelectionVectorSource] = useState<VectorSource>();
  const conflictsVectorSource = useRef<VectorSource>();
  const { conflictsStore } = useMst();

  useEffect(() => {
    const selectVectorSource = new VectorSource();
    setSelectionVectorSource(selectVectorSource);

    const conflictsSource = new VectorSource();
    conflictsVectorSource.current = conflictsSource;


    const map = new Map({
      target: mapElementRef.current as HTMLElement,
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        new VectorLayer({ source: selectVectorSource }),
        new VectorLayer({ source: conflictsSource })
      ],
      view: new View({
        center: [35, 32],
        zoom: 10,
        projection: 'EPSG:4326'
      })
    });

    setMap(map);
  }, [])

  useEffect(() => {
    const geojson = new GeoJSON();
    if (conflictsStore.conflictLocations.length > 0) {
      const featuresToAdd = conflictsStore.conflictLocations.map(location => geojson.readFeature(location));
      conflictsVectorSource.current?.addFeatures(featuresToAdd)
    }
  }, [conflictsStore.conflictLocations])

  useEffect(() => {
    if (geom) {
      const geojson = new GeoJSON();
      const geometry = geojson.readGeometry(geom);

      const feature = new Feature({ geometry: geometry });
      selectionVectorSource?.addFeature(feature);

      return () => {
        selectionVectorSource?.clear();
      };
    }
  }, [geom, selectionVectorSource])

  useEffect(() => {
    const options: DrawOptions = { type: GeometryType.CIRCLE, condition: condition.always }
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
      onPolygonSelected?.(geom as Geometry);
    };

    draw.on('drawend', onDrawEnd);

    return (() => {
      draw.un('drawend', onDrawEnd);
      map?.removeInteraction(draw);
    });
  }, [onPolygonSelected, drawMode, map])

  return (<div className="map" ref={mapElementRef}></div>)
});

export default OlMap;
