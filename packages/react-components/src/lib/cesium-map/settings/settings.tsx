import React, {useState} from 'react';
import { Dialog, DialogTitle, DialogContent, Icon, Button } from '@map-colonies/react-core';
import { Box } from '../../box';
import { CesiumSceneModeEnum } from '../map.types';
import { CesiumSceneModes } from './scene-modes';

import "./settings.css";
import { CesiumBaseMaps } from './base-maps';

export interface ISettingsBaseLayer {
  refId: string,
  opacity: number,
}

export interface IRasterLayer {
  id: string,
  type:  'OSM_LAYER' | 'WMTS_LAYER' | 'WMS_LAYER' | 'XYZ_LAYER';
  url: string
}

export interface IVectorLayer {
  id: string,
  url: string
}

export interface IBaseMaps {
  maps: [{
    id: string,
    title?: string,
    thumbnail?: string,
    baseRasteLayers: ISettingsBaseLayer[],
    baseVectorLayers: ISettingsBaseLayer[]
  }],
  rasteLayers: IRasterLayer[],
  vectoLayers: IVectorLayer[]
}

export interface RCesiumMapProps {
  baseMaps?: IBaseMaps;
  sceneModes: CesiumSceneModeEnum[]
}

export const CesiumSettings: React.FC<RCesiumMapProps> = (
  props
) => {
  const [isOpen, setIsOpen] = useState(false);
  const { sceneModes } = props;

  return (
    <>
      <Icon
        icon={
          <div style={{fill: 'red', width: '40px', height: '40px'}}>
            <svg width="100%" height="100%" viewBox="0 0 24 24" id="ic_settings_24px" x="288" y="24">
              <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65A.488.488 0 0 0 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
            </svg>
            {/* <svg style={{position: 'relative', top: '-40px'}}} width="100%" height="100%" viewBox="0 0 24 24">
              <path d="M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16z"/>
            </svg> */}
          </div>
        }
        onClick={(): void => {
          setIsOpen(true);
        }}
      />
      {
      isOpen && <div
        id="dialog-portal-example"
        className="settingsDialogPortal"
      >
        <Dialog 
          open={isOpen} 
          renderToPortal={true} 
          onClosed={(): void=> {setIsOpen(false)}}
          preventOutsideDismiss={true}
        >
          <DialogTitle>
            Map Settings
          </DialogTitle>
          <DialogContent>
            
            <h4 className="sectionLabel">Scene Mode</h4>
            <Box className="mapScenesContainer">
              <CesiumSceneModes sceneModes={sceneModes}></CesiumSceneModes>
            </Box>
            
            <Box className="baseMapsContainer">
              <h4 className="sectionLabel">Base Map</h4>
              <CesiumBaseMaps></CesiumBaseMaps>
            </Box>
            
            <Button
              raised
              type="button"
              onClick={(): void => {
                setIsOpen(false);
              }}
            >
              Ok
            </Button>
          </DialogContent>
        </Dialog>
      </div>
      }
    </>
  )

};