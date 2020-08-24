import React from 'react';
import { ContainerMap } from '../container-map';
import { MapFilterContainer } from '../map-filter-container';
import { action } from '@storybook/addon-actions';
import '@map-colonies/react-core/dist/theme/styles';
import '@map-colonies/react-core/dist/button/styles';
import '@map-colonies/react-core/dist/select/styles';
import '@map-colonies/react-core/dist/tooltip/styles';


export default {
  title: 'Map',
  component: ContainerMap,
  parameters: {
    layout: 'fullscreen'
  }
};

const mapDivStyle = {
  "height": "100%",
  "width": "100%",
  "position": "absolute" as const
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