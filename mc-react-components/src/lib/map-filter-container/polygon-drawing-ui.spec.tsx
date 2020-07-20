import React from 'react'
import renderer from 'react-test-renderer';
import { shallow, mount } from 'enzyme';
import { DrawType } from '../../models/enums';
import { PolygonSelectionUi } from './polygon-selection-ui';

// const conflictFetcher = () => Promise.resolve(JSON.parse(fs.readFileSync("./public/conflicts.json").toString()));
const mockStartDraw = jest.fn();
const mockResetState = jest.fn();
jest.mock('../models/rootStore', () => {
  return {
    useStore: jest.fn().mockImplementation(() => {
      return { 
        mapStore: { startDraw: mockStartDraw, resetState: mockResetState },
        conflictsStore: {searchParams:{resetLocation: jest.fn()}}
     };
    })
  }
});

afterEach(() => {
  mockStartDraw.mockClear();
  mockResetState.mockClear();
});
afterAll(() => mockStartDraw.mockRestore());

it('renders correctly', () => {
  // const store = rootStore.create({}, { fetch: conflictFetcher })
  const tree = renderer
    .create(<PolygonSelectionUi />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('sets drawing to polygon on click', () => {
  const wrapper = shallow(<PolygonSelectionUi />);
  wrapper.findWhere(n => n.type() === 'button' && n.text() === 'polygon').simulate('click');
  expect(mockStartDraw).toHaveBeenCalledWith(DrawType.polygon);
  expect(mockStartDraw).toHaveBeenCalledTimes(1);
});

it('calls start drawing box on button click', () => {
  const wrapper = shallow(<PolygonSelectionUi />);
  wrapper.findWhere(n => n.type() === 'button' && n.text() === 'box').simulate('click');
  expect(mockStartDraw).toHaveBeenCalledWith(DrawType.box);
  expect(mockStartDraw).toHaveBeenCalledTimes(1);
})

it('calls start drawing box on button click', () => {
  const wrapper = shallow(<PolygonSelectionUi />);
  wrapper.findWhere(n => n.type() === 'button' && n.text() === 'cancel').simulate('click');
  expect(mockResetState).toHaveBeenCalledTimes(1);
})