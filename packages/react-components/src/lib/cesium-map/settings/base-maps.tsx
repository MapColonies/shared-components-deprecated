import React, { useState } from 'react';
import { UrlTemplateImageryProvider, Viewer, WebMapServiceImageryProvider } from 'cesium';

import { CesiumSceneMode, CesiumSceneModeEnum } from '../map.types';
import { useCesiumMap } from '../map';

import { IBaseMap, IBaseMaps } from './settings';

import "./base-maps.css";

export interface RCesiumBaseMapsProps {
  baseMaps?: IBaseMaps;
}

export const CesiumBaseMaps: React.FC<RCesiumBaseMapsProps> = ( props ) => {
  const mapViewer: Viewer = useCesiumMap();
  const [currentMap, setCurrentMap] =  useState<string>(' ');
  const { baseMaps } = props;

  const handleMapSection = (id: string): void => {
    console.log('Setting map as bck -->', id);
    // eslint-disable-next-line 
    console.log(mapViewer.imageryLayers._layers.length);

    if (baseMaps){
      mapViewer.layersManager.removeBaseMapLayers();

      const selectedBaseMap = baseMaps.maps.find((map: IBaseMap) => map.id === id);
      if(selectedBaseMap)
      {
        const sortedBaseMapLayers = selectedBaseMap.baseRasteLayers.sort((layer1, layer2) => layer1.zIndex - layer2.zIndex);
        sortedBaseMapLayers.forEach((layer, idx) => {
          let cesiumLayer;
          switch (layer.type){
            case 'XYZ_LAYER':
              cesiumLayer = mapViewer.imageryLayers.addImageryProvider(    
                new UrlTemplateImageryProvider({
                  ...layer.options,
                  defaultAlpha: layer.opacity
                }), 
                idx
              );
              break;
            case 'WMS_LAYER':
              cesiumLayer = mapViewer.imageryLayers.addImageryProvider(    
                new WebMapServiceImageryProvider({
                  ...layer.options,
                  defaultAlpha: layer.opacity
                }), 
                idx
              );
              break;
          }
          cesiumLayer.meta = {
            parenBasetMapId: selectedBaseMap.id,
            ...layer
          }
          cesiumLayer.alex =  '*******CUSTOM*******';
        });
      }
    }

  };

  return (
    <>
      <label className="mapLabel">{currentMap}</label>
      <ul className="mapSelector">
        {
          baseMaps.maps.map((map: IBaseMap) => 
            <li className="mapContainer" key={map.id} >
              <img 
                alt={''} 
                className="mapContainerImg"
                src={map.thumbnail}
                onMouseOver={(): void => { setCurrentMap(map.title) }} 
                onClick={(): void => { handleMapSection(map.id) }}
              />
            </li>
          )
        }
      </ul>
    </>
  );
}