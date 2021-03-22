import React, { useLayoutEffect } from 'react';
import {
  Viewer as CesiumViewer,
  ImageryLayer
} from 'cesium';
import { ImageryLayer as ResiumImageryLayer } from 'resium';
import { ImageryLayerProps } from 'resium/dist/types/src/ImageryLayer/ImageryLayer';
import { useCesiumMap } from '../map';

export interface RCesiumImageryLayerProps extends ImageryLayerProps {
  meta?: any;
}

export const CesiumImageryLayer: React.FC<RCesiumImageryLayerProps> = (
  props
) => {
  const { meta, ...restProps } = props;
  const mapViewer: CesiumViewer = useCesiumMap();
  
  useLayoutEffect(() => {
    (mapViewer as any).layersManager.addMetaToLayer(/*meta*/{alex: 'kuku'}, (layer: ImageryLayer, idx: number): boolean=>{
      return true;// layer._imageryProvider._resource._url === meta.url;
    });
  }, [meta]);
  
  return <ResiumImageryLayer {...restProps} />;
};
