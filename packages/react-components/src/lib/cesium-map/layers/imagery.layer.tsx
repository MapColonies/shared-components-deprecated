import React, { ComponentProps, useLayoutEffect } from 'react';
import { ImageryLayer } from 'cesium';
import { ImageryLayer as ResiumImageryLayer } from 'resium';
import { CesiumViewer, useCesiumMap } from '../map';

export interface RCesiumImageryLayerProps extends ComponentProps<typeof ResiumImageryLayer> {
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
      /* eslint-disable */
      meta.searchLayerPredicate ??
        ((layer: ImageryLayer, idx: number): boolean => {
          if (meta !== undefined) {
            return (
              (layer as any)._imageryProvider._resource._url ===
              meta.options.url
            );
          }
          return false;
        })
      /* eslint-enable */
    );
  }, [meta, mapViewer]);

  return <ResiumImageryLayer {...restProps} />;
};
