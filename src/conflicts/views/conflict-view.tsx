import React from 'react';
import './conflict-view.css'
import ConflictMap from '../components/conflict-map';
import ConflictsList from '../components/conflicts-list';
import { SearchFilter } from '../components/conflict-search-filter';

const ConflictView: React.FC = () => {
  return (
    <div>
      <SearchFilter />
      <div className="flex-container">
        <div className="list-pane">
          <ConflictsList />
        </div>
        <div className="map-pane">
          <ConflictMap></ConflictMap>
        </div>
      </div>
    </div>
  );
}

export default ConflictView;
