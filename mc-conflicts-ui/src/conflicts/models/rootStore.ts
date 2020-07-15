import { types, Instance, getEnv } from "mobx-state-tree";
import { useContext, createContext } from 'react';
import { ConflictStore } from './conflictStore';

export const baseRootStore = types
  .model({
    conflictsStore: types.optional(ConflictStore, { state: 'pending', searchParams: {} }),
    // mapStore: types.optional(ConflictMapState, {})
  })
  .views(self => ({
    get fetch() {
      return getEnv(self).fetch;
    }
  }));

export const rootStore = baseRootStore.actions(self => ({
  afterCreate() {
    self.conflictsStore.fetchConflicts()
  }
}));
export interface IBaseRootStore extends Instance<typeof baseRootStore> { };
export interface IRootStore extends Instance<typeof rootStore> { };
const RootStoreContext = createContext<null | IRootStore | IBaseRootStore>(null);

export const StoreProvider = RootStoreContext.Provider;
export const useStore = () => {
  const store = useContext(RootStoreContext);
  if (store === null) {
    throw new Error("Store cannot be null, please add a context provider");
  }
  return store;
}