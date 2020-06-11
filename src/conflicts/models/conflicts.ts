import { types, Instance, flow, cast } from "mobx-state-tree";
import { Location } from './location';
import { Conflict, IConflict } from './conflict';
import Axios, { AxiosResponse } from 'axios';
import { ApiHttpResponse } from '../../common/models/api-response';
import { PaginationResult } from '../../common/models/pagination-result';

type conflictResponse = ApiHttpResponse<PaginationResult<IConflict[]>>;
type conflictAxiosResponse = AxiosResponse<conflictResponse>;

export const ConflictsStore = types.model({
  conflicts: types.array(Conflict),
  state: types.enumeration("State", ["pending", "done", "error"])
}).actions(self => ({
  fetchConflicts: flow(function* fetchConflicts() {
    self.conflicts = cast([]);
    self.state = 'pending';
    try {
      const result: conflictAxiosResponse = yield Axios.get('http://localhost:8000/conflicts');
      const conflicts = result.data.data.data;

      self.conflicts.replace(conflicts.map((conflict) => {
        const newConflict = {...conflict};
        newConflict.created_at = new Date(conflict.created_at);
        newConflict.updated_at = new Date(conflict.updated_at);
        newConflict.resolved_at = conflict.resolved_at ? new Date(conflict.resolved_at) : null;
        newConflict.deleted_at = conflict.deleted_at ? new Date(conflict.deleted_at) : null
        return newConflict;
      }));
      self.state = 'done';
    } catch (error) {
      self.state = 'error';
      console.log(error);
      
    }
  })
}))
// Generator<Promise<AxiosResponse<ApiHttpResponse<PaginationResult<IConflict[]>>>>>;
export interface IConflictsStore extends Instance<typeof ConflictsStore> { }