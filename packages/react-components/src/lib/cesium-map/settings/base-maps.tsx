import React, { useState, useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { CesiumViewer, useCesiumMap } from '../map';
import { IBaseMap, IBaseMaps } from './settings';

import './base-maps.css';

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    mapContainer: {
      width: '60px',
      height: '60px',
      border: `${theme.palette.background.paper} 2px solid`,
    },
  })
);

export interface RCesiumBaseMapsProps {
  baseMaps?: IBaseMaps;
}

export const CesiumBaseMaps: React.FC<RCesiumBaseMapsProps> = (props) => {
  const mapViewer: CesiumViewer = useCesiumMap();
  const { baseMaps } = props;
  const [currentMap, setCurrentMap] = useState<string>(' ');
  const [selectedBaseMap, setSelectedBaseMap] = useState<
    IBaseMap | undefined
  >();
  const classes = useStyle();

  useEffect(() => {
    const defaultMap = baseMaps?.maps.find((map: IBaseMap) => map.isCurrent);
    if (defaultMap) {
      setSelectedBaseMap(defaultMap);
      setCurrentMap(defaultMap.title !== undefined ? defaultMap.title : ' ');
    }
  }, [baseMaps]);

  const handleMapSection = (id: string): void => {
    if (baseMaps) {
      // Remove previous base-map layers
      mapViewer.layersManager?.removeBaseMapLayers();

      // Change base-map: add base-map layers by zIndex order
      const selectedBaseMap = baseMaps.maps.find(
        (map: IBaseMap) => map.id === id
      );
      if (selectedBaseMap) {
        mapViewer.layersManager?.setBaseMapLayers(selectedBaseMap);

        setSelectedBaseMap(selectedBaseMap);

        baseMaps.maps.forEach((map: IBaseMap) => {
          map.isCurrent = selectedBaseMap === map;
        });
      }
    }
  };

  return (
    <>
      <label className="mapLabel">{currentMap}</label>
      <ul className="mapSelector">
        {baseMaps?.maps.map((map: IBaseMap) => (
          <li
            className={`mapContainer ${classes.mapContainer} ${
              map === selectedBaseMap ? 'mapContainerSelected' : ''
            }`}
            key={map.id}
          >
            <img
              alt={''}
              className="mapContainerImg"
              src={map.thumbnail}
              onMouseOver={(): void => {
                setCurrentMap(map.title as string);
              }}
              onMouseOut={(): void => {
                setCurrentMap(
                  selectedBaseMap?.title !== undefined
                    ? selectedBaseMap.title
                    : ' '
                );
              }}
              onClick={(): void => {
                handleMapSection(map.id);
              }}
            />
          </li>
        ))}
      </ul>
    </>
  );
};
