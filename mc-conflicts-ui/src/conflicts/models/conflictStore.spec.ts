import * as fs from 'fs';
import { rootStore } from './rootStore';
import { when } from 'mobx';
import { IConflictsStore } from './conflictStore';

const locations = [
  {
    properties: {},
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [35.2137, 31.7683],
    },
  },
  {
    properties: {},
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [34.7818, 32.0853],
    },
  },
  {
    properties: {},
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [34.9896, 32.794],
    },
  },
];

const conflicts = JSON.parse(
  fs.readFileSync('./public/conflicts.json').toString()
);

const conflictSpy = jest.fn().mockReturnValue(conflicts);

const conflictFetcher = () => new Promise((resolve) => resolve(conflictSpy()));

let conflictsStore: IConflictsStore;

beforeEach(() => {
  conflictsStore = rootStore.create({}, { fetch: conflictFetcher }).conflictsStore;
});

afterEach(() => {
  conflictSpy.mockClear();
})

it('return an array of features of the conflicts location', async () => {
  await when(() => conflictsStore.state === 'done');
  const result = conflictsStore.conflictLocations;

  expect(result).toEqual(locations);
});

it('sets the selected conflict to the correct value', () => {
  conflictsStore.selectConflict(conflicts[0]);

  conflictsStore.resetSelectedConflict();

  expect(conflictsStore.selectedConflict).toBeUndefined();
});

it('resetSelection set the selected conflict to undefined', () => {
  conflictsStore.selectConflict(conflicts[0]);

  conflictsStore.resetSelectedConflict();

  expect(conflictsStore.selectedConflict).toBeUndefined();
});

it('format and set the conflicts, and set state to done on fetch', async () => {
  expect.assertions(2);

  await conflictsStore.fetchConflicts();

  expect(conflictsStore.state).toEqual('done');
  expect(conflictsStore.conflicts.length).toEqual(3);
});

it('set state to error when there is an error fetching the conflicts', async () => {
  expect.assertions(1);
  const errorConflictStore = rootStore.create(
    {},
    { fetch: () => Promise.reject(new Error()) }
  ).conflictsStore;

  await errorConflictStore.fetchConflicts();

  expect(errorConflictStore.state).toEqual('error');
});

it('calls fetch conflicts on search params snapshot', () => {
  conflictSpy.mockClear();
  
  conflictsStore.searchParams.setResolved(true);

  expect(conflictSpy).toHaveBeenCalledTimes(1);
})
