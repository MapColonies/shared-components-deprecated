import React, { useRef, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Map } from '../../common/components/ol-map/map';
import { useMst } from '../models/Root';
import { TileLayer } from '../../common/components/ol-map/layers/tile-layer';
import { TileOsm } from '../../common/components/ol-map/source/osm';
import { VectorLayer } from '../../common/components/ol-map/layers/vector-layer';
import { VectorSource } from '../../common/components/ol-map/source/vector-source';
import { GeoJSONFeature } from '../../common/components/ol-map/feature';


// export interface OlMapProps {
//   onPolygonSelected?: (geom: Geometry) => void,
//   drawMode: DrawModes,
//   geom?: Geometry
// };

const ConflictMap: React.FC = observer(() => {
  // const mapElementRef = useRef<HTMLDivElement>(null);
  // // const mapRef = useRef<Map>();
  // const [map, setMap] = useState<Map>();
  // const [selectionVectorSource, setSelectionVectorSource] = useState<VectorSource>();
  // const conflictsVectorSource = useRef<VectorSource>();
  const { conflictsStore } = useMst();

  // useEffect(() => {
  //   const selectVectorSource = new VectorSource();
  //   setSelectionVectorSource(selectVectorSource);

  //   const conflictsSource = new VectorSource();
  //   conflictsVectorSource.current = conflictsSource;


  //   const map = new Map({
  //     target: mapElementRef.current as HTMLElement,
  //     layers: [
  //       new TileLayer({
  //         source: new OSM()
  //       }),
  //       new VectorLayer({ source: selectVectorSource }),
  //       new VectorLayer({ source: conflictsSource })
  //     ],
  //     view: new View({
  //       center: [35, 32],
  //       zoom: 10,
  //       projection: 'EPSG:4326'
  //     })
  //   });

  //   setMap(map);
  // }, [])

  // useEffect(() => {
  //   const geojson = new GeoJSON();
  //   if (conflictsStore.conflictLocations.length > 0) {
  //     const featuresToAdd = conflictsStore.conflictLocations.map(location => geojson.readFeature(location));
  //     conflictsVectorSource.current?.addFeatures(featuresToAdd)
  //   }
  // }, [conflictsStore.conflictLocations])

  // useEffect(() => {
  //   if (geom) {
  //     const geojson = new GeoJSON();
  //     const geometry = geojson.readGeometry(geom);

  //     const feature = new Feature({ geometry: geometry });
  //     selectionVectorSource?.addFeature(feature);

  //     return () => {
  //       selectionVectorSource?.clear();
  //     };
  //   }
  // }, [geom, selectionVectorSource])

  // useEffect(() => {
  //   const options: DrawOptions = { type: GeometryType.CIRCLE, condition: condition.always }
  //   switch (drawMode) {
  //     case DrawModes.none:
  //       return;
  //     case DrawModes.box:
  //       options.geometryFunction = createBox();
  //       break;
  //     case DrawModes.polygon:
  //       options.type = GeometryType.POLYGON;
  //       break;
  //   }

  //   const draw = new Draw(options);
  //   map?.addInteraction(draw)

  //   const onDrawEnd = (e: DrawEvent) => {
  //     const geoJson = new GeoJSON();
  //     const geom = geoJson.writeGeometryObject(e.feature.getGeometry())
  //     onPolygonSelected?.(geom as Geometry);
  //   };

  //   draw.on('drawend', onDrawEnd);

  //   return (() => {
  //     draw.un('drawend', onDrawEnd);
  //     map?.removeInteraction(draw);
  //   });
  // }, [onPolygonSelected, drawMode, map])

  return (
    <Map>
      <TileLayer><TileOsm />
      </TileLayer>
      <VectorLayer>
        <VectorSource>
          {conflictsStore.conflicts.map((conflict) => <GeoJSONFeature geometry={conflict.location}/>)}
        </VectorSource>
      </VectorLayer>
    </Map >
  );
});

export default ConflictMap;
