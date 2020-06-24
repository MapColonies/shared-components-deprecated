import React, { useEffect } from 'react';
import { useTileLayer } from '../layers/tile-layer';
import { OSM } from 'ol/source';



export const TileOsm: React.FC = (props) => {
  const tileLayer = useTileLayer();

  useEffect(() => {
    tileLayer.setSource(new OSM())
  }, [tileLayer])

  return null;
};