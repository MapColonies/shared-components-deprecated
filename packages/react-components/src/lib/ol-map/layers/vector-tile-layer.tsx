import React, { useEffect, useState, createContext, useContext } from 'react';
import VectorTile from 'ol/layer/VectorTile';
import { Options } from 'ol/layer/Base';
import { useMap } from '../map';
import { MapStyle, defaultStyle } from '../style';

export interface VectorTileLayerProps {
  options?: Options;
  style?: MapStyle;
}

const vectorTileLayerContext = createContext<VectorTile | null>(null);
const VectorTileLayerProvider = vectorTileLayerContext.Provider;

export const useVectorTileLayer = (): VectorTile => {
  const layer = useContext(vectorTileLayerContext);

  if (layer === null) {
    throw new Error(
      'vector tile layer context is null, please check the provider'
    );
  }

  return layer;
};

export const VectorTileLayer: React.FC<VectorTileLayerProps> = ({
  children,
  options,
  style,
}) => {
  const map = useMap();
  const [vectorTileLayer] = useState(
    new VectorTile({
      ...options,
      style: style ? style : defaultStyle,
    })
  );

  useEffect(() => {
    map.addLayer(vectorTileLayer);
    return (): void => {
      map.removeLayer(vectorTileLayer);
    };
  }, [map, vectorTileLayer]);

  useEffect(() => {
    vectorTileLayer.setStyle(style ? style : defaultStyle);
  }, [vectorTileLayer, style]);

  return (
    <VectorTileLayerProvider value={vectorTileLayer}>
      {children}
    </VectorTileLayerProvider>
  );
};
