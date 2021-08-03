import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Icon,
} from '@map-colonies/react-core';
import { get } from 'lodash';
import { Box } from '../../box';
import { IRasterLayer, IVectorLayer } from '../layers-manager';
import { CesiumSceneModeEnum } from '../map.types';
import { CesiumSceneModes } from './scene-modes';
import { CesiumBaseMaps } from './base-maps';
import './settings.css';

export interface IBaseMap {
  id: string;
  title?: string;
  thumbnail?: string;
  isCurrent?: boolean;
  baseRasteLayers: IRasterLayer[];
  baseVectorLayers: IVectorLayer[];
}

export interface IBaseMaps {
  maps: IBaseMap[];
}

export interface RCesiumMapProps {
  sceneModes: CesiumSceneModeEnum[];
  baseMaps?: IBaseMaps;
  locale?: { [key: string]: string };
}

const SETTINGS_SVG_ID = 'ic_settings_24px';

export const CesiumSettings: React.FC<RCesiumMapProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { sceneModes, baseMaps, locale } = props;
  const dialogPortalRef = useRef(null);

  const dlgTitle = get(locale, 'MAP_SETTINGS_DIALOG_TITLE') ?? 'Map Settings';
  const sceneModeTitle =
    get(locale, 'MAP_SETTINGS_SCENE_MODE_TITLE') ?? 'Scene Mode';
  const baseMapTitle = get(locale, 'MAP_SETTINGS_BASE_MAP_TITLE') ?? 'Base Map';
  // const btnOkText = get(locale, 'MAP_SETTINGS_OK_BUTTON_TEXT') ?? 'Ok';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      /* eslint-disable */
      const target: any = event.target;
      const dlgPortalRef: any = get(dialogPortalRef, 'current');
      if (
        dlgPortalRef &&
        !dlgPortalRef.contains(target) &&
        target.id !== SETTINGS_SVG_ID &&
        target.parentElement?.id !== SETTINGS_SVG_ID
      ) {
        document.removeEventListener('click', handleClickOutside, false);
        setIsOpen(false);
      }
      /* eslint-enable */
    };

    document.addEventListener('click', handleClickOutside, false);

    return (): void => {
      document.removeEventListener('click', handleClickOutside, false);
    };
  });

  return (
    <>
      <Icon
        icon={
          <div className="settingsIconContainer">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 24 24"
              id={SETTINGS_SVG_ID}
              x="288"
              y="24"
            >
              <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65A.488.488 0 0 0 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
            </svg>
            {/* Layers ICON */}
            {/* <svg width="100%" height="100%" viewBox="0 0 24 24">
              <path d="M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16z"/>
            </svg> */}
          </div>
        }
        onClick={(): void => {
          setIsOpen(!isOpen);
        }}
      />
      {isOpen && (
        <div
          id="dialog-portal-example"
          className="settingsDialogPortal"
          ref={dialogPortalRef}
        >
          <Dialog
            open={isOpen}
            onClosed={(): void => {
              setIsOpen(false);
            }}
          >
            <DialogTitle>{dlgTitle}</DialogTitle>
            <DialogContent>
              <h4 className="sectionLabel">{sceneModeTitle}</h4>
              <Box className="mapScenesContainer">
                <CesiumSceneModes sceneModes={sceneModes}></CesiumSceneModes>
              </Box>

              <Box className="baseMapsContainer">
                {baseMaps && (
                  <>
                    <h4 className="sectionLabel">{baseMapTitle}</h4>
                    <CesiumBaseMaps baseMaps={baseMaps}></CesiumBaseMaps>
                  </>
                )}
              </Box>

              {/* <Button
              raised
              type="button"
              style={{margin: 'auto 40%'}}
              onClick={(): void => {
                setIsOpen(false);
              }}
            >
              {btnOkText}
            </Button> */}
            </DialogContent>
          </Dialog>
        </div>
      )}
    </>
  );
};
