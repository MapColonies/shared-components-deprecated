import React from 'react';
import { action } from '@storybook/addon-actions';
import { Button, Typography } from '@map-colonies/react-core';
import { MapFilterContainer } from '../map-filter-container';
import { CSFStory } from '../../utils/story';
import { Box } from '../..';
import { VectorLayer, VectorSource, GeoJSONFeature } from '../../ol-map';

export default {
  title: 'Map Filter Container',
  component: MapFilterContainer,
  parameters: {
    layout: 'fullscreen',
  },
};

export const Basic: CSFStory<JSX.Element> = () => (
  <MapFilterContainer
    handlePolygonReset={action('vector source cleared')}
    handlePolygonSelected={action('shape selected')}
  />
);

export const ExtraFilters: CSFStory<JSX.Element> = () => (
  <MapFilterContainer
    filters={[
      <Button outlined raised>
        dont click me
      </Button>,
      <Button outlined raised>
        also dont click me
      </Button>,
    ]}
    handlePolygonReset={action('vector source cleared')}
    handlePolygonSelected={action('shape selected')}
  />
);

export const WithChildren: CSFStory<JSX.Element> = () => (
  <MapFilterContainer
    handlePolygonReset={action('vector source cleared')}
    handlePolygonSelected={action('shape selected')}
  >
    <Box style={{ height: '300px' }}>
      <Typography tag="div" style={{ margin: '16px 0' }} use="headline1">
        Generic title
      </Typography>
    </Box>
  </MapFilterContainer>
);

export const WithMapContent: CSFStory<JSX.Element> = () => (
  <MapFilterContainer
    handlePolygonReset={action('vector source cleared')}
    handlePolygonSelected={action('shape selected')}
    mapContent={
      <VectorLayer>
        <VectorSource>
          <GeoJSONFeature
            geometry={{
              type: 'Polygon',
              coordinates: [
                [
                  [35.25787353515625, 31.942839972853083],
                  [35.0628662109375, 31.70713974681462],
                  [35.429534912109375, 31.7059714181356],
                  [35.25787353515625, 31.942839972853083],
                ],
              ],
            }}
          />
        </VectorSource>
      </VectorLayer>
    }
  />
);
