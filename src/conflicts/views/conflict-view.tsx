import React from 'react';
import './conflict-view.css'
import ConflictMap from '../components/conflict-map';
import ConflictsList from '../components/conflicts-list';
import { PolygonDrawingUi } from '../components/polygon-drawing-ui';

const ConflictView: React.FC = () => {
  return (
    <div className="flex-container">
      <div className="list-pane">
        <PolygonDrawingUi />
        <ConflictsList />
      </div>
      <div className="map-pane">
        <ConflictMap></ConflictMap>
      </div>
    </div>
  );
}

export default ConflictView;
