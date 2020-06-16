import { types, Instance } from "mobx-state-tree";
import { Geometry } from '@turf/helpers';
import { DrawType } from '../../common/components/ol-map/interactions/draw';

export const ConflictMapState = types.model({
  drawState: types.maybeNull(types.number),
  currentGeometry: types.maybeNull(types.frozen<Geometry>())
}).actions(self => {
  const startDraw = (type: DrawType) => {
    self.drawState = type;
  };

  const setGeometry = (geom: Geometry) => {
    self.currentGeometry = geom;
    self.drawState = null
  };

  const resetState = () => {
    self.currentGeometry = null;
    self.drawState = null;
  }

  return {startDraw, setGeometry, resetState};
})

export interface IConflictMapState extends Instance<typeof ConflictMapState> { }