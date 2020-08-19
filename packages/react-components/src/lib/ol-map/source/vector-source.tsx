import React, { useEffect, useState, createContext, useContext } from 'react';

import { Vector } from 'ol/source';
import { useVectorLayer } from '../layers/vector-layer';

const vectorSourceContext = createContext<Vector | null>(null);
const VectorSourceProvider = vectorSourceContext.Provider;

export const useVectorSource = (): Vector => {
  const source = useContext(vectorSourceContext);

  if (source === null) {
    throw new Error('vector source context is null, please check the provider');
  }

  return source;
};

export const VectorSource: React.FC = ({ children }) => {
  const vectorLayer = useVectorLayer();
  const [vectorSource] = useState(new Vector());

  useEffect((): void => {
    vectorLayer.setSource(vectorSource);
  }, [vectorSource, vectorLayer]);

  return (
    <VectorSourceProvider value={vectorSource}>{children}</VectorSourceProvider>
  );
};
