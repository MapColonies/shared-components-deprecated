import React from 'react';
import { action } from '@storybook/addon-actions';
import { ContainerMap } from '../container-map';
import { MapFilterContainer } from '../map-filter-container';
import { CSFStory } from '../../utils/story';

export default {
  title: 'Container Map',
  component: ContainerMap,
  parameters: {
    layout: 'fullscreen',
  },
};

const mapDivStyle = {
  height: '100%',
  width: '100%',
  position: 'absolute' as const,
};
export const Basic: CSFStory<JSX.Element> = () => (
  <div style={mapDivStyle}>
    <ContainerMap onPolygonSelection={action('shape selected')} />
  </div>
);

export const withDrawer: CSFStory<JSX.Element> = () => (
  <MapFilterContainer
    handlePolygonReset={action('vector source cleared')}
    handlePolygonSelected={action('shape selected')}
  />
);

withDrawer.story = {
  name: 'with Drawer',
};
