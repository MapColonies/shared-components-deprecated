/* eslint-disable @typescript-eslint/no-magic-numbers */

export const toRadian = (num: number): number => {
  return (num * Math.PI) / 180;
};

export const toDegrees = (num: number): number => {
  return num * (180 / Math.PI);
};

export const getAltitude = (mapzoom: number): number => {
  //this equation is a transformation of the angular size equation solving for D. See: http://en.wikipedia.org/wiki/Forced_perspective
  const firstPartOfEq = 0.05 * (591657550.5 / Math.pow(2, mapzoom - 1) / 2); //amount displayed is .05 meters and map scale =591657550.5/(Math.pow(2,(mapzoom-1))))
  //this bit ^ essentially gets the h value in the angular size eq then divides it by 2
  const googleearthaltitude =
    firstPartOfEq *
    (Math.cos(toRadian(85.362 / 2)) / Math.sin(toRadian(85.362 / 2))); //85.362 is angle which google maps displays on a 5cm wide screen
  return googleearthaltitude;
};
