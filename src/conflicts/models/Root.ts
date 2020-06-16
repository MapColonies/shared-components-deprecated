import { types, Instance } from "mobx-state-tree";
import { useContext, createContext } from 'react';
import { ConflictsStore } from './conflicts';
import { ConflictMapState } from './map-state';


const rootModel = types.model({
  conflictsStore: ConflictsStore,
  mapStore: ConflictMapState
});

export const rootStore = rootModel.create({
  conflictsStore: {
    state: 'done',
    conflicts: [],
    selectedConflict: null,
    searchParams: {}
  },
  mapStore: {}
});

export interface IRootInstance extends Instance<typeof rootModel> { };
const RootStoreContext = createContext<null | IRootInstance>(null);

export const Provider = RootStoreContext.Provider;
export function useMst() {
  const store = useContext(RootStoreContext);
  if (store === null) {
    throw new Error("Store cannot be null, please add a context provider");
  }
  return store;
}