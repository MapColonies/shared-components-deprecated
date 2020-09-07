import { Fill, Stroke, Circle, Style } from 'ol/style';
import { StyleFunction } from 'ol/style/Style';

const fill = new Fill({
  color: 'rgba(255,255,255,0.4)',
});
const stroke = new Stroke({
  color: '#3399CC',
  width: 1.25,
});

export type MapStyle = Style | Style[] | StyleFunction;

export const defaultStyle = [
  new Style({
    image: new Circle({
      fill: fill,
      stroke: stroke,
      radius: 5,
    }),
    fill: fill,
    stroke: stroke,
  }),
];
