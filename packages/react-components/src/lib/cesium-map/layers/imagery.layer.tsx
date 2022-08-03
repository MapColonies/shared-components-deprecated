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
    mapViewer.layersManager?.addMetaToLayer(
      meta,
      meta.searchLayerPredicate ?? ((layer: ImageryLayer, idx: number): boolean => {
        if (meta !== undefined) {
          // eslint-disable-next-line
          return (layer as any)._imageryProvider._resource._url === meta.options.url;
        }
        return false;
      })
    );
  }, [meta, mapViewer]);

  return <ResiumImageryLayer {...restProps} />;
};
