import React, { useEffect } from 'react';
import OlXYZ, { Options } from 'ol/source/XYZ';
import { useTileLayer } from '../layers/tile-layer';

interface TileXYZProps {
  options: Options;
}

export interface XYZOptionParams {
  attributions?: string;
  url: string;
}

export const getXYZOptions = (optionParams: XYZOptionParams): Options => {
  const { attributions, url } = optionParams;

  const xyzOptions = {
    attributions,
    url,
  };

  return xyzOptions;
};
export const TileXYZ: React.FC<TileXYZProps> = (props) => {
  const tileLayer = useTileLayer();
  const { options } = props;

  useEffect(() => {
    tileLayer.setSource(new OlXYZ(options));
  }, [tileLayer, options]);

  return null;
};
