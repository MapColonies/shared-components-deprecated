import * as fs from 'fs';
import React from 'react';
import { shallow, mount } from 'enzyme';

import { baseRootStore, StoreProvider } from '../models/rootStore';
import { when } from 'mobx';
import { act } from 'react-dom/test-utils';
import ConflictItem from './conflict-item';
import { ConflictsTable } from './conflicts-table';

const originalWarn = console.warn.bind(console.warn)
beforeAll(() => {
  console.warn = (msg: any) => (
    !msg.toString().includes('observer batching') && originalWarn(msg))
})
afterAll(() => {
  console.warn = originalWarn
})
const conflicts = JSON.parse(fs.readFileSync("./public/conflicts.json").toString());
const conflictFetcher = () => Promise.resolve(conflicts);

it('render correctly and switch between status messages and content', async () => {
  expect.assertions(2);

  const mockStore = baseRootStore.create({}, { fetch: conflictFetcher })
  const wrapper = mount(<StoreProvider value={mockStore}><ConflictsTable /></StoreProvider>)
  expect(wrapper.find('div').text()).toEqual('loading...');
  await act(() => mockStore.conflictsStore.fetchConflicts());
  await when(() => mockStore.conflictsStore.state === 'done')
  wrapper.update();
  expect(wrapper.findWhere((n) => n.type() === ConflictItem).length).toEqual(3);
})

it('renders correctly and doesn\'t show any item if conflicts is empty', async () => {
  const mockStore = baseRootStore.create({}, { fetch: () => Promise.resolve({ data: { data: [] } }) })

  mockStore.conflictsStore.fetchConflicts();

  await when(() => mockStore.conflictsStore.state === 'done')
  const wrapper = mount(<StoreProvider value={mockStore}><ConflictsTable /></StoreProvider>);
  expect(wrapper.findWhere((n) => n.type() === ConflictItem).length).toEqual(0);
})

it('shows an error message when there is an error fetching the conflicts', async () => {
  const mockStore = baseRootStore.create({}, {
    fetch: () => Promise.reject(new Error())
  });

  mockStore.conflictsStore.fetchConflicts();

  await when(() => mockStore.conflictsStore.state === 'error')
  const wrapper = mount(<StoreProvider value={mockStore}><ConflictsTable /></StoreProvider>);
  expect(wrapper.findWhere((n) => n.type() === ConflictItem).length).toEqual(0);
  expect(wrapper.find('div').text()).toEqual('error!');
})