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
  title: string;
  noLegendsText: string;
  legends?: IMapLegend[];
}

const closeIconSvg = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24"
    viewBox="0 0 24 24"
    width="24"
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
);

export const MapLegendSidebar: React.FC<MapLegendSidebarProps> = ({
  isOpen,
  toggleSidebar,
  title,
  noLegendsText,
  legends = [],
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
          icon={closeIconSvg}
        />
        <MapLegendList
          noLegendsText={noLegendsText}
          legends={legends}
          actionsTexts={{ docText: 'Docs', imgText: 'View Image' }}
        />
      </DrawerContent>
    </Drawer>
  ) : null;
};
