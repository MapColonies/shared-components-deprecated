import React, { useEffect } from 'react';
import OlTileWMS, { Options } from 'ol/source/TileWMS';
import { useTileLayer } from '../layers/tile-layer';

interface TileWMSProps {
  options: Options;
}

export interface WMSOptionParams {
  attributions?: string;
  url: string;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  params: { [key: string]: any };
  serverType: 'carmentaserver' | 'geoserver' | 'mapserver' | 'qgis';
  transition: number;
}

export const getWMSOptions = (optionParams: WMSOptionParams): Options => {
  const { attributions, url, params, serverType, transition } = optionParams;

  const wmsOptions: Options = {
    attributions,
    url,
    params,
    serverType,
    transition,
  };

  return wmsOptions;
};
export const TileWMS: React.FC<TileWMSProps> = (props) => {
  const tileLayer = useTileLayer();
  const { options } = props;

  useEffect(() => {
    tileLayer.setSource(new OlTileWMS(options));
  }, [tileLayer, options]);

  return null;
};
