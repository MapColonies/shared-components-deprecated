import { types, Instance, flow, cast, getParent, onSnapshot, getSnapshot } from "mobx-state-tree";
import { ApiHttpResponse } from '../../common/models/api-response';
import { PaginationResult } from '../../common/models/pagination-result';
import { feature } from '@turf/helpers';
import { Feature, Geometry } from 'geojson'
import { ConflictSearchParams } from './conflict-search-params';
import { IRootStore } from './rootStore';

type conflictResponse = ApiHttpResponse<PaginationResult<IConflict[]>>;

const conflictFormatter = (conflict: IConflict) => {
  const newConflict = { ...conflict };

  newConflict.created_at = new Date(conflict.created_at);
  newConflict.updated_at = new Date(conflict.updated_at);
  newConflict.resolved_at = conflict.resolved_at ? new Date(conflict.resolved_at) : null;
  newConflict.deleted_at = conflict.deleted_at ? new Date(conflict.deleted_at) : null
  return newConflict;
}


const Conflict = types.model({
  id: types.identifier,
  source_server: types.string,
  target_server: types.string,
  source_entity: types.frozen(),
  target_entity: types.frozen(),
  description: types.string,
  location: types.frozen<Geometry>(),
  has_resolved: types.boolean,
  resolved_at: types.maybeNull(types.Date),
  resolution_id: types.maybeNull(types.string),
  created_at: types.Date,
  updated_at: types.Date,
  deleted_at: types.maybeNull(types.Date),
})

export const ConflictStore = types
  .model({
    conflicts: types.array(Conflict),
    state: types.enumeration("State", ["pending", "done", "error"]),
    selectedConflict: types.safeReference(Conflict),
    searchParams: types.optional(ConflictSearchParams, {})
  })
  .views(self => ({
    get conflictLocations(): Feature<Geometry>[] {
      return self.conflicts.map((conflict) => feature<Geometry>(conflict.location, {}));
    },
    get root(): IRootStore {
      return getParent(self);
    }
  }))
  .actions(self => {
    const resetSelectedConflict = () => {
      self.selectedConflict = undefined;
    }

    const selectConflict = (conflict: IConflict) => {
      self.selectedConflict = conflict;
    }

    const fetchConflicts = flow(function* fetchConflicts(): Generator<Promise<conflictResponse>, void, conflictResponse> {
      self.conflicts = cast([]);
      self.state = 'pending';
      const snapshot = getSnapshot(self.searchParams);
      const params: any = {}
      if (snapshot.from) {
        params.from = snapshot.from / 1000;
      }
      if (snapshot.to) {
        params.to = snapshot.to / 1000;
      }
      params.geojson = snapshot.geojson;
      params.resolved = snapshot.resolved;

      try {
        const result = yield self.root.fetch("/conflicts", params);
        const conflicts = result.data.data;
        resetSelectedConflict()
        self.conflicts.replace(conflicts.map(conflictFormatter));
        self.state = 'done';
      } catch (error) {
        self.state = 'error';
      }
    })

    const afterCreate = () => {
      onSnapshot(self.searchParams, () => {
        if (self.searchParams.isDateRangeValid) {
          // @ts-ignore
          self.fetchConflicts();
        }
      })
    }

    return { fetchConflicts, selectConflict, resetSelectedConflict, afterCreate }
  })


export interface IConflict extends Instance<typeof Conflict> { }
export interface IConflictsStore extends Instance<typeof ConflictStore> { }