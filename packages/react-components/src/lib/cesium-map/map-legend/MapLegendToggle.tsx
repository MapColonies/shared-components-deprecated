import React from 'react';
import { Icon } from '@map-colonies/react-core';
import { Box } from '../../box';
import './MapLegend.css';

interface MapLegendProps {
  onClick: () => void;
}

const legendIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    enable-background="new 0 0 24 24"
    height="24"
    width="24"
    viewBox="0 0 612 612"
  >
    <g xmlns="http://www.w3.org/2000/svg">
      <path d="M322.4,173.9l-129,16.2l-4.6,21.4l25.3,4.7c16.5,3.9,19.8,9.9,16.2,26.4l-41.5,195.3c-10.9,50.5,5.9,74.3,45.5,74.3   c30.7,0,66.3-14.2,82.5-33.6l4.9-23.4c-11.3,9.9-27.7,13.9-38.6,13.9c-15.5,0-21.1-10.9-17.1-30L322.4,173.9z" />
      <circle cx="270.1" cy="56.3" r="56.3" />
    </g>
  </svg>
);

export const MapLegendToggle: React.FC<MapLegendProps> = ({ onClick }) => {
  return (
    <Box onClick={onClick} className="mapLegendToggleContainer">
      <Icon icon={legendIcon} className="mapLegendIcon" />
    </Box>
  );
};
