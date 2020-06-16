import React from 'react';
import './conflict-view.css'
import ConflictMap from '../components/conflict-map';
import ConflictsList from '../components/conflicts-list';
import { Provider, rootStore } from '../models/Root';
import { PolygonDrawingUi } from '../components/polygon-drawing-ui';

const ConflictView: React.FC = () => {
  return (
    <Provider value={rootStore}>
      <div className="flex-container">
        <div className="list-pane">
          <PolygonDrawingUi/>
          <ConflictsList />
        </div>
        <div className="map-pane">
          <ConflictMap></ConflictMap>
        </div>
      </div>
    </Provider>
  );
}

export default ConflictView;
