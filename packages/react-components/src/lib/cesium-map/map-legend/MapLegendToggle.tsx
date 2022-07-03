import React from 'react';
import { Box } from '../../box';
import './MapLegend.css';

interface MapLegendProps {
  onClick: () => void
}

export const MapLegendToggle: React.FC<MapLegendProps> = ({ onClick }) => {
  return <Box onClick={onClick} className="mapLegendToggleContainer"></Box>;
};
