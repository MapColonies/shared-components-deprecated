import React, { useCallback } from 'react';
import { Box } from '../../box';
import './MapLegend.css';

export interface IMapLegend {
  layer?: string;
  legendDoc?: string;
  legendImg?: string;
  legend?: string;
}
interface MapLegendProps {
  legend: IMapLegend;
  docText?: string;
  imgText?: string;
}

export const MapLegend: React.FC<MapLegendProps> = ({
  legend: { legendImg, legendDoc, layer },
  docText,
  imgText,
}) => {
  const handleLegendImgOpen = useCallback(() => {
    // Open image in a new tab.
    window.open(legendImg, '_blank');
  }, [legendImg]);

  const handleLegendDocOpen = useCallback(() => {
    // Open doc in a new tab.
    window.open(legendDoc, '_blank');
  }, [legendDoc]);

  return (
    <Box className="mapLegend">
      <Box className="layerNameContainer">
        <h3 className="layerName">{layer}</h3>
      </Box>
      <img
        alt="Map Legend"
        className="legendImg"
        src={legendImg}
        onClick={handleLegendImgOpen}
      />
      <Box className="legendActionsContainer">
        <p className="legendAction" onClick={handleLegendImgOpen}>
          {imgText}
        </p>
        <p className="legendAction" onClick={handleLegendDocOpen}>
          {docText}
        </p>
      </Box>
    </Box>
  );
};
