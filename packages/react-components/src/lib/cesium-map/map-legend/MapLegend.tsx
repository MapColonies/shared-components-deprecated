import React, { useCallback } from 'react';
import { Box } from '../../box';
import './MapLegend.css';

export interface IMapLegend {
  layer?: string;
  legendDoc?: string;
  legendImg?: string;
  legend?: string;
}
interface MaplegendProps {
  legend: IMapLegend;
  docText?: string;
  imgText?: string;
}

export const MapLegend: React.FC<MaplegendProps> = ({
  legend: { legendImg, legendDoc, layer },
  docText, 
  imgText
}) => {
  const handlelegendImgOpen = useCallback(() => {
    // Open image in a new tab.
    window.open(legendImg, '_blank');
  }, [legendImg]);

  const handlelegendDocOpen = useCallback(() => {
    // Open doc in a new tab.
    window.open(legendDoc, '_blank');
  }, [legendDoc]);

  return (
    <Box className="mapLegend">
      <Box className="layerNameContainer">
        <h3 className='layerName'>{layer}</h3>
      </Box>
        <img
          alt="legend Image"
          className="legendImg"
          src={legendImg}
          onClick={handlelegendImgOpen}
        />
      <Box className="legendActionsContainer">
        <p className="legendAction" onClick={handlelegendImgOpen}>
          {imgText}
        </p>
        <p className="legendAction" onClick={handlelegendDocOpen}>
          {docText}
        </p>
      </Box>
    </Box>
  );
};
