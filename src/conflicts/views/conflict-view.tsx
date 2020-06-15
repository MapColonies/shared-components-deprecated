import React, { useState } from 'react';
import './conflict-view.css'
import OlMap, { DrawModes } from '../components/ol-map';
import ConflictsList from '../components/conflicts-list';
import { Provider, rootStore } from '../models/Root';
import { Geometry } from '@turf/helpers';

const ConflictView: React.FC = () => {
  const [drawMode, setDrawMode] = useState(DrawModes.none);
  const [geom, setGeom] = useState<Geometry>();
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
            setGeom(geom)
            setDrawMode(DrawModes.none);
            rootStore.conflictsStore.fetchConflicts({location:geom})
          }} />
        </div>
      </div>
    </Provider>
  );
}

export default ConflictView;
