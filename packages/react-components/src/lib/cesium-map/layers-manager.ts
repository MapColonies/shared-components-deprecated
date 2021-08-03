/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ImageryLayer,
  UrlTemplateImageryProvider,
  WebMapServiceImageryProvider,
  WebMapTileServiceImageryProvider,
} from 'cesium';
import { get } from 'lodash';
import {
  RCesiumOSMLayerOptions,
  RCesiumWMSLayerOptions,
  RCesiumWMTSLayerOptions,
  RCesiumXYZLayerOptions,
} from './layers';
import { CesiumViewer } from './map';
import { IBaseMap } from './settings/settings';

export interface ICesiumImageryLayer extends InstanceType<typeof ImageryLayer> {
  meta?: Record<string, unknown>;
}

export interface IRasterLayer {
  id: string;
  type: 'OSM_LAYER' | 'WMTS_LAYER' | 'WMS_LAYER' | 'XYZ_LAYER';
  opacity: number;
  zIndex: number;
  show?: boolean;
  options:
    | RCesiumOSMLayerOptions
    | RCesiumWMSLayerOptions
    | RCesiumWMTSLayerOptions
    | RCesiumXYZLayerOptions;
}

export interface IVectorLayer {
  id: string;
  opacity: number;
  zIndex: number;
  url: string;
}

class LayerManager {
  public mapViewer: CesiumViewer;

  private readonly layers: ICesiumImageryLayer[];

  public constructor(mapViewer: CesiumViewer) {
    this.mapViewer = mapViewer;
    // eslint-disable-next-line
    this.layers = (this.mapViewer.imageryLayers as any)._layers;
  }

  /* eslint-disable */
  public addMetaToLayer(
    meta: any,
    layerPredicate: (layer: ImageryLayer, idx: number) => boolean
  ): void {
    const layer = this.layers.find(layerPredicate);
    if (layer) {
      layer.meta = meta;
    }
  }
  /* eslint-enable */

  public setBaseMapLayers(baseMap: IBaseMap): void {
    const sortedBaseMapLayers = baseMap.baseRasteLayers.sort(
      (layer1, layer2) => layer1.zIndex - layer2.zIndex
    );
    sortedBaseMapLayers.forEach((layer, idx) => {
      this.addRasterLayer(layer, idx, baseMap.id);
    });
  }

  public addRasterLayer(
    layer: IRasterLayer,
    index: number,
    parentId: string
  ): void {
    let cesiumLayer: ICesiumImageryLayer | undefined;
    switch (layer.type) {
      case 'XYZ_LAYER':
        cesiumLayer = this.mapViewer.imageryLayers.addImageryProvider(
          new UrlTemplateImageryProvider(
            layer.options as UrlTemplateImageryProvider.ConstructorOptions
          ),
          index
        );
        break;
      case 'WMS_LAYER':
        cesiumLayer = this.mapViewer.imageryLayers.addImageryProvider(
          new WebMapServiceImageryProvider(
            layer.options as WebMapServiceImageryProvider.ConstructorOptions
          ),
          index
        );
        break;
      case 'WMTS_LAYER':
        cesiumLayer = this.mapViewer.imageryLayers.addImageryProvider(
          new WebMapTileServiceImageryProvider(
            layer.options as WebMapTileServiceImageryProvider.ConstructorOptions
          ),
          index
        );
        break;
      case 'OSM_LAYER':
        break;
    }
    if (cesiumLayer) {
      cesiumLayer.alpha = layer.opacity;
      cesiumLayer.meta = {
        parentBasetMapId: parentId,
        ...layer,
      };
      if (layer.show !== undefined) {
        cesiumLayer.show = layer.show;
      }
    }
  }

  public removeLayer(layerId: string): void {
    const layer = this.findLayerById(layerId);

    if (layer) {
      this.mapViewer.imageryLayers.remove(layer, true);
    }
  }

  public removeBaseMapLayers(): void {
    const layerToDelete = this.layers.filter((layer) => {
      const parentId = get(layer.meta, 'parentBasetMapId') as string;
      return parentId ? true : false;
    });
    layerToDelete.forEach((layer) => {
      this.mapViewer.imageryLayers.remove(layer, true);
    });
    // TODO: remove vector layers
  }

  public raise(layerId: string, positions = 1): void {
    const layer = this.findLayerById(layerId);

    if (layer) {
      for (let position = 0; position < positions; position++) {
        this.mapViewer.imageryLayers.raise(layer);
      }
    }
  }

  public lower(layerId: string, positions = 1): void {
    const layer = this.findLayerById(layerId);
    const lowerLimit = this.getBaseLayersCount();
    const layerIdx = this.mapViewer.imageryLayers.indexOf(
      layer as ImageryLayer
    );

    if (layerIdx - positions <= lowerLimit) {
      positions = layerIdx - lowerLimit;
    }

    if (layer) {
      for (let position = 0; position < positions; position++) {
        this.mapViewer.imageryLayers.lower(layer);
      }
    }
  }

  public raiseToTop(layerId: string): void {
    const layer = this.findLayerById(layerId);

    if (layer) {
      this.mapViewer.imageryLayers.raiseToTop(layer);
    }
  }

  public lowerToBottom(layerId: string): void {
    const layer = this.findLayerById(layerId);
    const lowerLimit = this.getBaseLayersCount();
    const layerIdx = this.mapViewer.imageryLayers.indexOf(
      layer as ImageryLayer
    );

    this.lower(layerId, layerIdx - lowerLimit);
    // if (layer) {
    //   this.mapViewer.imageryLayers.lowerToBottom(layer);
    // }
  }

  public length(): number {
    return this.mapViewer.imageryLayers.length;
  }

  public show(layerId: string, isShow: boolean): void {
    const layer = this.get(layerId);
    if (layer !== undefined) {
      layer.show = isShow;
    }
  }

  public showAll(isShow: boolean): void {
    const nonBaseLayers = this.layers.filter((layer) => {
      const parentId = get(layer.meta, 'parentBasetMapId') as string;
      return parentId ? false : true;
    });
    nonBaseLayers.forEach((layer: ICesiumImageryLayer) => {
      this.show(layer.meta?.id as string, isShow);
    });
  }

  public get(layerId: string): ICesiumImageryLayer | undefined {
    const layerInt = this.findLayerById(layerId);

    const layerIdx = this.mapViewer.imageryLayers.indexOf(
      layerInt as ImageryLayer
    );

    return layerIdx ? this.mapViewer.imageryLayers.get(layerIdx) : undefined;
  }

  private getBaseLayersCount(): number {
    const baseLayers = this.layers.filter((layer) => {
      const parentId = get(layer.meta, 'parentBasetMapId') as string;
      return parentId ? true : false;
    });
    return baseLayers.length;
  }

  private findLayerById(layerId: string): ICesiumImageryLayer | undefined {
    return this.layers.find((layer) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      return layer.meta !== undefined ? layer.meta.id === layerId : false;
    });
  }
}

export default LayerManager;
