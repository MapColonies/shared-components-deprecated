import React, { useCallback } from 'react';
import { Box } from '../../box';
import { IMapLegend, MapLegend } from './MapLegend';
import './MapLegend.css';

interface MapLegendListProps {
  legends: IMapLegend[];
  actionsTexts: {
    docText: string;
    imgText: string;
  };
  noLegendsText: string;
}

export const MapLegendList: React.FC<MapLegendListProps> = ({
  legends,
  actionsTexts: { docText, imgText },
  noLegendsText,
}) => {
  const handleNoLegends = useCallback(() => {
    return (
      <Box className="noLegendsContainer">
        <h2 className="noLegendsMsg">{noLegendsText}</h2>
      </Box>
    );
  }, []);

  const renderList = useCallback(() => {
    if (!legends.length) {
      return handleNoLegends();
    }

    return legends.map((legend) => {
      return <MapLegend legend={legend} docText={docText} imgText={imgText} />;
    });
  }, [legends]);

  return <Box className="mapLegendsList">{renderList()}</Box>;
};
