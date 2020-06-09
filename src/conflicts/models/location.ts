export enum LocationType {
  Point = 'Point',
  Polygon = 'Polygon'
}

export interface Location {
  type: LocationType;
  coordinates: number[]
}