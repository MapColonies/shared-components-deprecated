import { types, Instance } from "mobx-state-tree";
import { Geometry } from '@turf/helpers';

export const ConflictSearchParams = types.model({
  location: types.maybe(types.frozen<Geometry>()),
}).actions(self => {
  const setLocation = (geometry: Geometry) => {
    self.location = geometry
  }

  const resetLocation = () => {
    self.location = undefined;
  }

  return { setLocation, resetLocation };
})

export interface IConflictSearchParams extends Instance<typeof ConflictSearchParams> { }