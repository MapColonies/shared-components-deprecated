import React from 'react';
import { Geometries } from '@turf/helpers';
import { Proj } from '../../../utils/projections';
import { Map } from '../../map';
import { TileLayer, VectorLayer } from '../../layers';
import { GeoJSONFeature } from '../../feature';
import { TileOsm } from '..';
import { VectorSource } from '../vector-source';

export default {
  title: 'Map/Map Tiles/Geojson',
  component: VectorLayer,
  subcomponents: GeoJSONFeature,
  parameters: {
    layout: 'fullscreen',
  },
};

const geometries: Geometries[] = [
  {
    type: 'Polygon',
    coordinates: [
      [
        [3864197.52, 3750764.97],
        [3884682.65, 3750764.98],
        [3884682.65, 3766052.38],
        [3864197.53, 3766052.38],
        [3864197.52, 3750764.97],
      ],
    ],
  },
  {
    type: 'Polygon',
    coordinates: [
      [
        [3904403.4, 3765899.51],
        [3896912.58, 3758255.81],
        [3905779.27, 3743579.9],
        [3918162.07, 3755962.7],
        [3904403.4, 3765899.51],
      ],
    ],
  },
  {
    type: 'LineString',
    coordinates: [
      [3931767.86, 3763147.78],
      [3931003.49, 3724776.39],
    ],
  },
  {
    type: 'Point',
    coordinates: [3890186.12, 3734254.58],
  },
];

const mapDivStyle = {
  height: '100%',
  width: '100%',
  position: 'absolute' as const,
};

export const Basic = (): JSX.Element => (
  <div style={mapDivStyle}>
    <Map projection={Proj.WEB_MERCATOR}>
      <TileLayer>
        <TileOsm />
      </TileLayer>
      <VectorLayer>
        <VectorSource>
          {geometries.map((geometry, index) => (
            <GeoJSONFeature key={index} geometry={geometry} />
          ))}
        </VectorSource>
      </VectorLayer>
    </Map>
  </div>
);
