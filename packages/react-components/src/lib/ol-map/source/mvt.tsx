import React, { useEffect, createContext, useContext } from 'react';
import VectorTileSource, { Options } from 'ol/source/VectorTile';
import { MVT } from 'ol/format';
import { useVectorTileLayer } from '../layers/vector-tile-layer';

const vectorTileSourceContext = createContext<VectorTileSource | null>(null);

export const useVectorTileSource = (): VectorTileSource => {
  const source = useContext(vectorTileSourceContext);

  if (source === null) {
    throw new Error(
      'vector tile source context is null, please check the provider'
    );
  }

  return source;
};

export interface MVTSourceProps {
  options: Options;
}

export interface MVTOptionParams {
  url: string;
}

export const getMVTOptions = (optionParams: MVTOptionParams): Options => {
  const { url } = optionParams;
  const mvtOptions: Options = {
    url,
    format: new MVT(),
  };

  return mvtOptions;
};

export const MVTSource: React.FC<MVTSourceProps> = ({ children, options }) => {
  const vectorTileLayer = useVectorTileLayer();

  useEffect((): void => {
    vectorTileLayer.setSource(new VectorTileSource(options));
  }, [options, vectorTileLayer]);

  return null;
};
