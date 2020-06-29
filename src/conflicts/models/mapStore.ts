import { types, Instance } from "mobx-state-tree";
import { Geometry } from 'geojson';
import { DrawType } from '../../common/models/enums';

export const ConflictMapState = types
  .model({
    drawState: types.maybeNull(types.number),
    currentGeometry: types.maybeNull(types.frozen<Geometry>())
  })
  .actions(self => ({
    startDraw: function (type: DrawType) {
      self.drawState = type;
    },

    setGeometry: function (geom: Geometry | null) {
      self.currentGeometry = geom;
      self.drawState = null
    },

    resetState: function () {
      self.currentGeometry = null;
      self.drawState = null;
    }
  }))

export interface IConflictMapState extends Instance<typeof ConflictMapState> { }