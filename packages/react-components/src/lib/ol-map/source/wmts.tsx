import React, { useEffect } from 'react';
import { useTileLayer } from '../layers/tile-layer';
import { WMTS } from 'ol/source';
import { Options } from 'ol/source/WMTS';
import {get as getProjection} from 'ol/proj';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import {getTopLeft, getWidth} from 'ol/extent';

const RESOLUTIONS = 14,
      TILE_GRANULARITY=256,
      WMTS_RESOLUTION_BASIS=2;

interface TileWMTSProps {
  options: Options;
}

export interface WMTSOptionParams {
  attributions?: string;
  url: string;
  layer: string;
  projection: string;
  format: string;
  wrapX?: boolean;
}

export const getWMTSOptions = (params: WMTSOptionParams): Options=> {
  const projection = getProjection(params.projection);
  const projectionExtent = projection.getExtent();
  const resolutions = new Array<number>(RESOLUTIONS);
  const matrixIds = new Array<string>(RESOLUTIONS);
  const size = getWidth(projectionExtent) / TILE_GRANULARITY;
  for (let z = 0; z < RESOLUTIONS; ++z) {
    // generate resolutions and matrixIds arrays for this WMTS
    resolutions[z] = size / Math.pow(WMTS_RESOLUTION_BASIS, z);
    matrixIds[z] = z.toString();
  }

  const wmtsOptions={
    attributions: params.attributions,
    url: params.url,
    layer: params.layer,
    matrixSet: params.projection,
    format: params.format,
    projection: projection,
    tileGrid: new WMTSTileGrid({
      origin: getTopLeft(projectionExtent),
      resolutions: resolutions,
      matrixIds: matrixIds,
    }),
    style: 'default',
    wrapX: (params.wrapX !== undefined) ? params.wrapX : true,
  };

  return wmtsOptions;

}
export const TileWMTS: React.FC<TileWMTSProps> = (props) => {
  const tileLayer = useTileLayer();
  const { options } = props;

  useEffect(() => {
    tileLayer.setSource(new WMTS(options));
  }, [tileLayer, options]);

  return null;
};
