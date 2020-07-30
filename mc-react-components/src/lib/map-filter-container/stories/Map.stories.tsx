import React from 'react';
import { ContainerMap } from '../container-map';
import { MapFilterContainer } from '../map-filter-container';

export default {
  title: 'Map',
  component: ContainerMap,
};

const mapDivStyle = {
  "height": "100%",
  "width": "100%",
  "position": "fixed" as const,
};
export const Basic = () => <div style={mapDivStyle}>
    <ContainerMap onPolygonSelection={() => null}/>
  </div>;

export const withDrawer = () => <MapFilterContainer handlePolygonReset={() => null} handlePolygonSelected={() => null}/>;

withDrawer.story = {
  name: 'with Drawer',
};