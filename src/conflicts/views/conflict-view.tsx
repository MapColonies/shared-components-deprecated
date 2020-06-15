import React, { useState } from 'react';
import './conflict-view.css'
import ConflictMap from '../components/conflict-map';
import ConflictsList from '../components/conflicts-list';
import { Provider, rootStore } from '../models/Root';
import { Geometry } from '@turf/helpers';
import { ConflictMap2 } from '../components/conflict-map2';

const ConflictView: React.FC = () => {
  return (
    <Provider value={rootStore}>
      <div className="flex-container">
        <div className="list-pane">
          {/* <div>
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
          </div> */}
          <ConflictsList />
        </div>
        <div className="map-pane">
          {/* <ConflictMap geom={geom} drawMode={drawMode} onPolygonSelected={(geom) => {
            setGeom(geom)
            setDrawMode(DrawModes.none);
            rootStore.conflictsStore.fetchConflicts({location:geom})
          }} /> */}
          <ConflictMap></ConflictMap>
        </div>
      </div>
    </Provider>
  );
}

export default ConflictView;
