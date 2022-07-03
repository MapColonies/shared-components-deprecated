import React from 'react';
import { Box } from '../../box';
import './MapLegend.css';

interface MapLegendSidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export const MapLegendSidebar: React.FC<MapLegendSidebarProps> = ({
  isOpen,
  toggleSidebar,
}) => {
  return (
    isOpen ? (
      <Box className="mapLegendSidebarContainer" style={{animationDuration: '1s'}}>
        <Box
          onClick={toggleSidebar}
          style={{ position: 'absolute', top: 0, left: 0, cursor: 'pointer', fontSize: '24px' }}
        >
          X
        </Box>
      </Box>
    ) : null
  );
};
