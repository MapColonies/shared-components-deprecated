import React, { useEffect } from 'react';
import { OSM } from 'ol/source';
import { useTileLayer } from '../layers/tile-layer';

export const TileOsm: React.FC = (props) => {
  const tileLayer = useTileLayer();

  useEffect(() => {
    tileLayer.setSource(new OSM());
  }, [tileLayer]);

  return null;
};
