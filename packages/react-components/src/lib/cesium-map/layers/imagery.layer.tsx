import React, { useLayoutEffect } from 'react';
import { ImageryLayer } from 'cesium';
import { ImageryLayer as ResiumImageryLayer } from 'resium';
import { ImageryLayerProps } from 'resium/dist/types/src/ImageryLayer/ImageryLayer';
import { CesiumViewer, useCesiumMap } from '../map';

export interface RCesiumImageryLayerProps extends ImageryLayerProps {
  meta?: any;
}

export const CesiumImageryLayer: React.FC<RCesiumImageryLayerProps> = (
  props
) => {
  // eslint-disable-next-line
  const { meta, ...restProps } = props;
  const mapViewer: CesiumViewer = useCesiumMap();
  
  useLayoutEffect(() => {
    mapViewer.layersManager?.addMetaToLayer(/*meta*/{alex: 'kuku'}, (layer: ImageryLayer, idx: number): boolean=>{
      return true;// layer._imageryProvider._resource._url === meta.url;
    });
  }, [meta, mapViewer]);
  
  return <ResiumImageryLayer {...restProps} />;
};
