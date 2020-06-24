import { types, Instance } from "mobx-state-tree";
import { Geometry } from '@turf/helpers';

export const ConflictSearchParams = types
  .model({
    location: types.maybe(types.frozen<Geometry>()),
  })
  .actions(self => ({
    setLocation: function setLocation(geometry: Geometry) {
      self.location = geometry
    },

    resetLocation: function () {
      self.location = undefined;
    }
  }))

export interface IConflictSearchParams extends Instance<typeof ConflictSearchParams> { }