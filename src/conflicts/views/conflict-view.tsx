import React, { Props, useState } from 'react';
import './conflict-view.css'
import OlMap, { DrawModes } from '../components/ol-map';
import ConflictsList from '../components/conflicts-list';
import { GeoJSONGeometry } from 'ol/format/GeoJSON';
import { Provider, rootStore } from '../models/Root';

function ConflictView() {
  const [drawMode, setDrawMode] = useState(DrawModes.none);
  const [geom, setGeom] = useState<GeoJSONGeometry>();
  return (
    <Provider value={rootStore}>
      <div className="flex-container">
        <div className="list-pane">
          <div>
            <button onClick={() => {
              setDrawMode(DrawModes.polygon)
            }}>polygon</button>
            <button onClick={() => {
              setDrawMode(DrawModes.box)
            }}>box</button>
            <button onClick={() => {
              setDrawMode(DrawModes.none)
              setGeom(undefined);
            }}>cancel</button>
          </div>
          <ConflictsList />
        </div>
        <div className="map-pane">
          <OlMap geom={geom} drawMode={drawMode} onPolygonSelected={(geom) => {
            console.log(geom);
            setGeom(geom)
            setDrawMode(DrawModes.none);
          }} />
        </div>
      </div>
    </Provider>
  );
}

export default ConflictView;
