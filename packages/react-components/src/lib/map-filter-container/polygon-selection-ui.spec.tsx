import React from 'react';
import { shallow } from 'enzyme';
import { PolygonSelectionUi } from './polygon-selection-ui';
import { DrawType } from '../models';
import { MenuItem, Menu, Button } from '@map-colonies/react-core';

const startDraw = jest.fn();
const cancelDraw = jest.fn();
const resetDraw = jest.fn();
afterEach(() => {
  startDraw.mockClear();
  cancelDraw.mockClear();
  resetDraw.mockClear();
});

// it('renders correctly', () => {
//   // const store = rootStore.create({}, { fetch: conflictFetcher })
//   const tree = renderer
//     .create(
//       <PolygonSelectionUi
//         isSelectionEnabled={false}
//         onCancelDraw={() => {}}
//         onReset={() => {}}
//         onStartDraw={() => {}}
//       />
//     )
//     .toJSON();
//   expect(tree).toMatchSnapshot();
// });

it('opens the menu with drawing options on open menu button click', () => {
  const wrapper = shallow(
    <PolygonSelectionUi
      onStartDraw={startDraw}
      onCancelDraw={cancelDraw}
      onReset={resetDraw}
      isSelectionEnabled={false}
    />
  );

  expect(wrapper.find(Menu).prop('open')).toBe(false);

  wrapper.find(Button).simulate('click', { currentTarget: {} });

  expect(wrapper.find(Menu).prop('open')).toBe(true);
});

it('Polygon/box drawing menu items call start draw with correct params on click and closes the menu', () => {
  const wrapper = shallow(
    <PolygonSelectionUi
      onStartDraw={startDraw}
      onCancelDraw={cancelDraw}
      onReset={resetDraw}
      isSelectionEnabled={false}
    />
  );

  const openMenuButton = wrapper.find(Button);
  openMenuButton.simulate('click', { currentTarget: {} });

  wrapper
    .findWhere((n) => n.type() === MenuItem && n.prop('children') === 'Polygon')
    .simulate('click');

  expect(wrapper.find(Menu).prop('open')).toBe(false);
  expect(startDraw).toHaveBeenCalledWith(DrawType.POLYGON);
  expect(startDraw).toHaveBeenCalledTimes(1);

  startDraw.mockClear();

  openMenuButton.simulate('click', { currentTarget: {} });
  wrapper
    .findWhere((n) => n.type() === MenuItem && n.prop('children') === 'Box')
    .simulate('click');

  expect(wrapper.find(Menu).prop('open')).toBe(false);
  expect(startDraw).toHaveBeenCalledWith(DrawType.BOX);
  expect(startDraw).toHaveBeenCalledTimes(1);
});

it('clicking the clear menu item calls onreset and closes the menu', () => {
  const wrapper = shallow(
    <PolygonSelectionUi
      onStartDraw={startDraw}
      onCancelDraw={cancelDraw}
      onReset={resetDraw}
      isSelectionEnabled={false}
    />
  );

  const openMenuButton = wrapper.find(Button);
  openMenuButton.simulate('click', { currentTarget: {} });

  wrapper
    .findWhere((n) => n.type() === MenuItem && n.prop('children') === 'Clear')
    .simulate('click');

  expect(wrapper.find(Menu).prop('open')).toBe(false);
  expect(resetDraw).toHaveBeenCalledTimes(1);
});

it('Cancel draw is shown when IsSelectionEnabled is true, and clicking on the button calls onCancelDraw', () => {
  const wrapper = shallow(
    <PolygonSelectionUi
      onStartDraw={startDraw}
      onCancelDraw={cancelDraw}
      onReset={resetDraw}
      isSelectionEnabled={true}
    />
  );

  const button = wrapper.find(Button);

  expect(button.prop('children')).toBe('Cancel Draw');

  button.simulate('click');

  expect(cancelDraw).toHaveBeenCalledTimes(1);
});
