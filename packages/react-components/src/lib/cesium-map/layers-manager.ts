/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ImageryLayer,
  UrlTemplateImageryProvider,
  WebMapServiceImageryProvider
} from 'cesium';
import { get } from 'lodash';
import { CesiumViewer } from './map';
import { IRasterLayer, IBaseMap } from './settings/settings';


interface ICesiumImageryLayer extends InstanceType<typeof ImageryLayer>{
  meta?: any;
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
  public addMetaToLayer(meta: any, layerPredicate: (layer: ImageryLayer, idx: number) => boolean): void {
    const layer = this.layers.find(layerPredicate);
    if(layer){
      layer.meta = meta;
    }
  }
  /* eslint-enable */

  public setBaseMapLayers (baseMap: IBaseMap): void {
    const sortedBaseMapLayers = baseMap.baseRasteLayers.sort((layer1, layer2) => layer1.zIndex - layer2.zIndex);
    sortedBaseMapLayers.forEach((layer, idx) => {
      this.addRasterLayer(layer, idx, baseMap.id);
    });
  }

  public addRasterLayer(layer: IRasterLayer, index: number, parentId: string): void {
    let cesiumLayer: ICesiumImageryLayer | undefined;
    switch (layer.type){
      case 'XYZ_LAYER':
        cesiumLayer = this.mapViewer.imageryLayers.addImageryProvider(    
          new UrlTemplateImageryProvider(layer.options as UrlTemplateImageryProvider.ConstructorOptions), 
          index
        );
        break;
      case 'WMS_LAYER':
        cesiumLayer = this.mapViewer.imageryLayers.addImageryProvider(    
          new WebMapServiceImageryProvider(layer.options as WebMapServiceImageryProvider.ConstructorOptions), 
          index
        );
        break;
      case 'OSM_LAYER':
      case 'WMTS_LAYER':
        break;
    }
    if(cesiumLayer){
      cesiumLayer.alpha = layer.opacity;
      cesiumLayer.meta = {
        parentBasetMapId: parentId,
        ...layer
      }
    }
  }

  public removeLayer(layerId: string): void {
    const layer = this.layers.find((layer) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      return (layer.meta !== undefined) ? layer.meta.id === layerId : false;
    });
    
    if(layer){
      this.mapViewer.imageryLayers.remove(layer, true);
    }
  }

  public removeBaseMapLayers(): void {
    const layerToDelete = this.layers.filter(layer => {
      const parentId = get(layer.meta,'parentBasetMapId') as string;
      return parentId ? true: false;
    });
    layerToDelete.forEach(layer => {
      this.mapViewer.imageryLayers.remove(layer, true);
    });
    // TODO: remove vector layers
   
  }

}

export default LayerManager;
