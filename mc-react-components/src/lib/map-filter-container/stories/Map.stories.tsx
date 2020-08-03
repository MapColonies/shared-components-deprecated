import React from 'react';
import { ContainerMap } from '../container-map';
import { MapFilterContainer } from '../map-filter-container';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Map',
  component: ContainerMap,
};

const mapDivStyle = {
  "height": "100%",
  "width": "100%",
  "position": "fixed" as const
};
export const Basic = () => <div style={mapDivStyle}>
    <ContainerMap onPolygonSelection={action('shape selected')}/>
  </div>;

export const withDrawer = () => <MapFilterContainer
    handlePolygonReset={action('vector source cleared')}
    handlePolygonSelected={action('shape selected')}/>;

withDrawer.story = {
  name: 'with Drawer',
};