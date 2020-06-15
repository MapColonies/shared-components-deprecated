import React, { useRef, useEffect, useState } from 'react';
import { Map } from '../../common/components/ol-map/map';
import { TileLayer } from '../../common/components/ol-map/layers/tile-layer';
import { TileOsm } from '../../common/components/ol-map/source/osm';


export const ConflictMap2: React.FC = () => {
  return (
    <Map>
      <TileLayer>
        <TileOsm />
      </TileLayer>
    </Map>
  )
}