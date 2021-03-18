import React, { useState } from 'react';
import { Viewer, WebMapServiceImageryProvider } from 'cesium';

import { CesiumSceneMode, CesiumSceneModeEnum } from '../map.types';
import { useCesiumMap } from '../map';

import { IBaseMaps } from './settings';

import "./base-maps.css";

export interface RCesiumBaseMapsProps {
  baseMaps?: IBaseMaps;
}

export const CesiumBaseMaps: React.FC<RCesiumBaseMapsProps> = ( props ) => {
  const mapViewer: Viewer = useCesiumMap();
  const [currentMap, setCurrentMap] =  useState<string>(' ');
  // const { baseMaps } = props;
  const baseMaps = {
    maps: [
      {
        id: '1st',
        title: '1st Map Title',
        thumbnail: 'https://nsw.digitaltwin.terria.io/build/3456d1802ab2ef330ae2732387726771.png',
        baseRasteLayers: [], //ISettingsBaseLayer[],
        baseVectorLayers: [], //ISettingsBaseLayer[]
      },
      {
        id: '2nd',
        title: '2nd Map Title',
        thumbnail: 'https://nsw.digitaltwin.terria.io/build/efa2f6c408eb790753a9b5fb2f3dc678.png',
        baseRasteLayers: [], //ISettingsBaseLayer[],
        baseVectorLayers: [], //ISettingsBaseLayer[]
      }
    ],
    rasteLayers: [], //IRasterLayer[],
    vectoLayers: [], //IVectorLayer[]
  };

  const handleMapSection = (id: string): void => {
    console.log('Setting map as bck -->', id);
    // eslint-disable-next-line 
    console.log(mapViewer.imageryLayers._layers.length);

    const layer = mapViewer.imageryLayers.addImageryProvider(    
      new WebMapServiceImageryProvider({
        url:
          "https://mesonet.agron.iastate.edu/cgi-bin/wms/goes/conus_ir.cgi?",
        layers: "goes_conus_ir",
        credit: "Infrared data courtesy Iowa Environmental Mesonet",
        parameters: {
          transparent: "true",
          format: "image/png",
        },
      })
    );
    layer.alex =  '*******CUSTOM*******';
    
    // layer.alpha = Cesium.defaultValue(alpha, 0.5);
    // layer.show = Cesium.defaultValue(show, true);
    // layer.name = name;


  };

  return (
    <>
      <label className="mapLabel">{currentMap}</label>
      <ul className="mapSelector">
        {
          baseMaps.maps.map((map) => 
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