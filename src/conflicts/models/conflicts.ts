import { types, Instance, flow, cast } from "mobx-state-tree";
import { Conflict, IConflict } from './conflict';
import Axios, { AxiosResponse } from 'axios';
import { ApiHttpResponse } from '../../common/models/api-response';
import { PaginationResult } from '../../common/models/pagination-result';
import { feature, Feature, Geometry } from '@turf/helpers';
import IConflictRequestParams from './conflict-request-params';

type conflictResponse = ApiHttpResponse<PaginationResult<IConflict[]>>;
type conflictAxiosResponse = AxiosResponse<conflictResponse>;
export const ConflictsStore = types.model({
  conflicts: types.array(Conflict),
  state: types.enumeration("State", ["pending", "done", "error"]),
  selectedConflict: types.maybeNull(types.reference(Conflict))

}).views(self => ({
  get conflictLocations(): Feature<Geometry>[] {
    return self.conflicts.map((conflict) => feature<Geometry>(conflict.location,{}));
  }

})).actions(self => {
  const fetchConflicts = flow(function* fetchConflicts(params?: IConflictRequestParams): Generator<Promise<conflictAxiosResponse>, void, conflictAxiosResponse> {
    self.conflicts = cast([]);
    self.state = 'pending';
    try {
      console.log(params);
      
      const result = yield Axios.post<conflictResponse>(`${process.env.REACT_APP_API_BASE_URL}/conflicts`, params);
      const conflicts = result.data.data.data;

      self.selectedConflict = null;
      self.conflicts.replace(conflicts.map((conflict) => {
        const newConflict = { ...conflict };
        
        newConflict.created_at = new Date(conflict.created_at);
        newConflict.updated_at = new Date(conflict.updated_at);
        newConflict.resolved_at = conflict.resolved_at ? new Date(conflict.resolved_at) : null;
        newConflict.deleted_at = conflict.deleted_at ? new Date(conflict.deleted_at) : null
        newConflict.location = JSON.parse(newConflict.location as unknown as string)
        return newConflict;
      }));
      self.state = 'done';
    } catch (error) {
      self.state = 'error';
      console.log(error);
    }
  })

  const selectConflict = (conflict: IConflict | null) => {
    self.selectedConflict = conflict;
  } 

  return {fetchConflicts, selectConflict}
})
export interface IConflictsStore extends Instance<typeof ConflictsStore> { }