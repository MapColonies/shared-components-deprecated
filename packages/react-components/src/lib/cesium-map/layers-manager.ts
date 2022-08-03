/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ImageryLayer,
  UrlTemplateImageryProvider,
  WebMapServiceImageryProvider,
  WebMapTileServiceImageryProvider,
  Event,
} from 'cesium';
import { get } from 'lodash';
import { Feature, Point, Polygon } from 'geojson';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import {
  RCesiumOSMLayerOptions,
  RCesiumWMSLayerOptions,
  RCesiumWMTSLayerOptions,
  RCesiumXYZLayerOptions,
} from './layers';
import { CesiumViewer } from './map';
import { IBaseMap } from './settings/settings';
import { pointToGeoJSON } from './tools/geojson/point.geojson';
import { IMapLegend } from './map-legend';

const INC = 1;
const DEC = -1;

export interface ICesiumImageryLayer extends InstanceType<typeof ImageryLayer> {
  meta?: Record<string, unknown>;
}

export type LayerType = 'OSM_LAYER' | 'WMTS_LAYER' | 'WMS_LAYER' | 'XYZ_LAYER';

export interface IRasterLayer {
  id: string;
  type: LayerType;
  opacity: number;
  zIndex: number;
  show?: boolean;
  options:
    | RCesiumOSMLayerOptions
    | RCesiumWMSLayerOptions
    | RCesiumWMTSLayerOptions
    | RCesiumXYZLayerOptions;
  details?: Record<string, unknown>;
}

export interface IVectorLayer {
  id: string;
  opacity: number;
  zIndex: number;
  url: string;
}

export type LegendExtractor = (
  layers: (any & {
    meta: any;
  })[]
) => IMapLegend[];
class LayerManager {
  public mapViewer: CesiumViewer;

  private readonly layers: ICesiumImageryLayer[];
  public legendsList: IMapLegend[];
  public layerUpdated: Event;
  private readonly legendsExtractor?: LegendExtractor;

  public constructor(mapViewer: CesiumViewer, legendsExtractor? : LegendExtractor, onLayersUpdate?: () => void) {
    this.mapViewer = mapViewer;
    // eslint-disable-next-line
    this.layers = (this.mapViewer.imageryLayers as any)._layers;
    this.legendsList = [];
    this.legendsExtractor = legendsExtractor;
    this.layerUpdated = new Event();
    if(onLayersUpdate) {
      this.layerUpdated.addEventListener(onLayersUpdate, this);
    }

    this.mapViewer.imageryLayers.layerRemoved.addEventListener(() => {
      this.setLegends();
      this.layerUpdated.raiseEvent();
    })
  }

  /* eslint-disable */
  public addMetaToLayer(
    meta: any,
    layerPredicate: (layer: ImageryLayer, idx: number) => boolean
  ): void {
    const layer = this.layers.find(layerPredicate);
    if (layer) {
      layer.meta = meta;
      this.setLegends();
      this.layerUpdated.raiseEvent();
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

  // Remove all non base layers
  public removeNotBaseMapLayers(): void {
    const layerToDelete = this.layers.filter((layer) => {
      const parentId = get(layer.meta, 'parentBasetMapId') as string;
      return parentId ? false : true;
    });
    layerToDelete.forEach((layer) => {
      this.mapViewer.imageryLayers.remove(layer, true);
    });
    // TODO: remove vector layers
  }

  public raise(layerId: string, positions = 1): void {
    const layer = this.findLayerById(layerId);
    const order = (layer?.meta as Record<string, unknown>).zIndex as number;

    if (layer) {
      for (let position = 0; position < positions; position++) {
        this.mapViewer.imageryLayers.raise(layer);
      }
    }

    this.updateLayersOrder(layerId, order, order + positions);
  }

  public lower(layerId: string, positions = 1): void {
    const layer = this.findLayerById(layerId);
    const order = (layer?.meta as Record<string, unknown>).zIndex as number;
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

    this.updateLayersOrder(layerId, order, order - positions);
  }

  public raiseToTop(layerId: string): void {
    const layer = this.findLayerById(layerId);
    const order = (layer?.meta as Record<string, unknown>).zIndex as number;

    if (layer) {
      this.mapViewer.imageryLayers.raiseToTop(layer);
    }

    this.updateLayersOrder(
      layerId,
      order,
      this.mapViewer.imageryLayers.length - this.getBaseLayersCount() - 1
    );
  }

  public lowerToBottom(layerId: string): void {
    const layer = this.findLayerById(layerId);
    // const order = (layer?.meta as Record<string, unknown>).zIndex as number;
    const lowerLimit = this.getBaseLayersCount();
    const layerIdx = this.mapViewer.imageryLayers.indexOf(
      layer as ImageryLayer
    );

    this.lower(layerId, layerIdx - lowerLimit);
    // if (layer) {
    //   this.mapViewer.imageryLayers.lowerToBottom(layer);
    // }

    // this.updateLayersOrder(layerId, order, 0);
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

  public showAllNotBase(isShow: boolean): void {
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

  public findLayerByPOI(
    x: number,
    y: number
  ): ICesiumImageryLayer[] | undefined {
    const position = pointToGeoJSON(this.mapViewer, x, y) as Feature<Point>;

    const nonBaseLayers = this.layers.filter((layer) => {
      const parentId = get(layer.meta, 'parentBasetMapId') as string;
      return parentId ? false : true;
    });

    const selectedVisibleLayers = nonBaseLayers.filter((layer) => {
      const layerFootprint = get(layer.meta, 'details.footprint') as
        | Polygon
        | undefined;
      if (layerFootprint !== undefined) {
        const isInLayer = booleanPointInPolygon(position.geometry, {
          type: 'Feature',
          properties: {},
          geometry: layerFootprint,
        });
        return isInLayer && layer.show;
      } else {
        console.warn('CesiumImageryLayer has no defined footprint', layer.meta);
        return false;
      }
    });

    return selectedVisibleLayers.sort((layer1, layer2) => {
      // @ts-ignore
      return layer2.meta?.zIndex - layer1.meta?.zIndex;
    });
  }

  private setLegends(): void {
    if(typeof this.legendsExtractor !== 'undefined') {
      this.legendsList = this.legendsExtractor(this.layers);
    }
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

  private updateLayersOrder(id: string, from: number, to: number): void {
    const move = from > to ? INC : DEC;
    const min = from < to ? from : to;
    const max = from < to ? to : from;

    this.layers.forEach((layer) => {
      const parentId = get(layer.meta, 'parentBasetMapId') as string;
      if (!parentId) {
        const layerOrder = layer.meta?.zIndex as number;
        (layer.meta as Record<string, unknown>).zIndex =
          layerOrder >= min && layerOrder <= max && layerOrder !== from
            ? layerOrder + move
            : layerOrder === from
            ? to
            : layerOrder;
      }
    });
  }
}

export default LayerManager;
