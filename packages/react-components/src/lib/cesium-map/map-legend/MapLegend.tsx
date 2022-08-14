import React, { useCallback } from 'react';
import { Tooltip } from '@map-colonies/react-core';
import { Box } from '../../box';

import './MapLegend.css';

export interface IMapLegend {
  layer?: string;
  legendDoc?: string;
  legendImg?: string;
  legend?: Record<string, unknown>[];
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

  const renderLayerName = useCallback(() => {
    const MAX_LAYER_NAME_LENGTH = 15;

    const layerNameContainer = (
      <Box className="layerNameContainer">
        <h3
          style={{ maxWidth: `${MAX_LAYER_NAME_LENGTH}ch` }}
          className="layerName"
        >
          {layer}
        </h3>
      </Box>
    );

    if ((layer ?? '').length > MAX_LAYER_NAME_LENGTH) {
      return <Tooltip content={layer}>{layerNameContainer}</Tooltip>;
    }

    return layerNameContainer;
  }, [layer]);

  const renderLinks = useCallback(() => {
    return [
      typeof legendImg === 'string' && (
        <a
          className="legendAction"
          href={legendImg}
          target="_blank"
          rel="noreferrer"
        >
          {imgText}
        </a>
      ),
      typeof legendDoc === 'string' && (
        <a
          className="legendAction"
          href={legendDoc}
          target="_blank"
          rel="noreferrer"
        >
          {docText}
        </a>
      ),
    ];
  }, [legendImg, imgText, legendDoc, docText]);

  return (
    <Box className="mapLegend">
      {renderLayerName()}
      <img
        alt="Map Legend"
        className="legendImg"
        src={legendImg}
        onClick={handleLegendImgOpen}
      />
      <Box className="legendActionsContainer">{renderLinks()}</Box>
    </Box>
  );
};
