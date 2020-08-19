import React, { useEffect, useState, createContext, useContext } from 'react';
import { Vector } from 'ol/layer';
import { useMap } from '../map';

const vectorLayerContext = createContext<Vector | null>(null);
const VectorLayerProvider = vectorLayerContext.Provider;

export const useVectorLayer = (): Vector => {
  const layer = useContext(vectorLayerContext);

  if (layer === null) {
    throw new Error('vector layer context is null, please check the provider');
  }

  return layer;
};

export const VectorLayer: React.FC = ({ children }) => {
  const map = useMap();
  const [vectorLayer] = useState(new Vector());

  useEffect(() => {
    map.addLayer(vectorLayer);
    return (): void => {
      map.removeLayer(vectorLayer);
    };
  }, [map, vectorLayer]);

  return (
    <VectorLayerProvider value={vectorLayer}>{children}</VectorLayerProvider>
  );
};
