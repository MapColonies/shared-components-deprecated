import {
  Icon,
  Drawer,
  DrawerHeader,
  DrawerTitle,
  DrawerContent,
} from '@map-colonies/react-core';
import React from 'react';
import { Box } from '../../box';
import { IMapLegend } from './MapLegend';
import './MapLegend.css';
import { MapLegendList } from './MapLegendList';

interface MapLegendSidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  title?: string;
  noLegendsText?: string;
  legends?: IMapLegend[];
  actionsTexts?: { docText: string; imgText: string };
}

export const MapLegendSidebar: React.FC<MapLegendSidebarProps> = ({
  isOpen,
  toggleSidebar,
  title = 'Map Legends',
  noLegendsText = 'No legends to display...',
  legends = [],
  actionsTexts = { docText: 'Docs', imgText: 'View Image' },
}) => {
  return isOpen ? (
    <Drawer
      className="mapLegendSidebarContainer"
      modal={false}
      dismissible={true}
      open={isOpen}
    >
      <DrawerHeader className="sidebarHeaderContainer">
        <DrawerTitle className="sidebarTitle">{title}</DrawerTitle>
      </DrawerHeader>
      <DrawerContent className="sidebarContent">
        <Icon
          onClick={toggleSidebar}
          className="mapLegendCloseBtn"
          icon={{icon: 'close', size: 'small'}}
        />
        <MapLegendList
          noLegendsText={noLegendsText}
          legends={legends}
          actionsTexts={actionsTexts}
        />
      </DrawerContent>
    </Drawer>
  ) : null;
};
