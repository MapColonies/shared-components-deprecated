import React, { useEffect } from 'react';
import { Geometry } from '@turf/helpers';
import { GeoJSON } from 'ol/format'
import { useVectorSource } from './source/vector-source';

export interface FeatureProps {
  geometry: Geometry
}

export const GeoJSONFeature: React.FC<FeatureProps> = ({geometry}) => {
  const source = useVectorSource();


  useEffect(() => {
    const geoJSON = new GeoJSON();
    const feature = geoJSON.readFeature(geometry);
    source.addFeature(feature);
    return () => {source.removeFeature(feature)};
  }, [geometry, source])

  return null;
};