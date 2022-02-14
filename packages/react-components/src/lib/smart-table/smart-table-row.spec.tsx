import React from 'react';
import { shallow } from 'enzyme';
import { IconButton, Collapse, TableCell, TableRow } from '@material-ui/core';
import { SmartTableRow } from './smart-table-row';
import { items, headCells } from './__mock-data__/smartTableMocks';

const item = items[0];

it('adds an IconButton and Collapse area if collapse is enabled and renders the element', () => {
  const collapsedElementMock = jest.fn();

  const wrapper = shallow(
    <SmartTableRow
      cellsMetadata={headCells}
      isCollapseable={true}
      isRowSelected={false}
      item={item}
      rowIndex={0}
      collapsedElement={collapsedElementMock}
    />
  );

  expect(wrapper.exists(IconButton)).toBeTruthy();
  expect(wrapper.exists(Collapse)).toBeTruthy();

  expect(collapsedElementMock).toHaveBeenCalledWith(item);
  expect(collapsedElementMock).toHaveBeenCalledTimes(1);

  wrapper.setProps({ isCollapseable: false });
  expect(wrapper.exists(IconButton)).toBeFalsy();
  expect(wrapper.exists(Collapse)).toBeFalsy();
});

it('opens the collapseable panel when the button is pressed', () => {
  const wrapper = shallow(
    <SmartTableRow
      cellsMetadata={headCells}
      isCollapseable={true}
      isRowSelected={false}
      item={item}
      rowIndex={0}
    />
  );

  expect(wrapper.find(Collapse).props()).toHaveProperty('in', false);

  wrapper.find(IconButton).simulate('click', { stopPropagation: jest.fn() });

  expect(wrapper.find(Collapse).props()).toHaveProperty('in', true);
});

it('generates tablecells with the correct properties and runs transform', () => {
  const rowIndex = 0;
  const wrapper = shallow(
    <SmartTableRow
      cellsMetadata={headCells}
      isCollapseable={false}
      isRowSelected={false}
      item={item}
      rowIndex={rowIndex}
    />
  );

  /* eslint-disable @typescript-eslint/no-unsafe-assignment */
  const firstTableCellProps = wrapper
    .findWhere(
      (n) =>
        n.type() === TableCell &&
        n.key() === headCells[0].id + rowIndex.toString()
    )
    .props();
  /* eslint-disable @typescript-eslint/no-unsafe-assignment */
  const secondTableCellProps = wrapper
    .findWhere(
      (n) =>
        n.type() === TableCell &&
        n.key() === headCells[1].id + rowIndex.toString()
    )
    .props();

  expect(firstTableCellProps).toHaveProperty('align', 'left');
  expect(secondTableCellProps).toHaveProperty('align', 'right');

  expect(firstTableCellProps).toHaveProperty('padding', 'none');
  expect(secondTableCellProps).toHaveProperty('padding', 'default');

  // expect(firstTableCellProps).toHaveProperty('children', '42');
  expect(headCells[0].transform).toHaveBeenCalledWith(item.first);
  expect(secondTableCellProps).toHaveProperty('children', item.second);
});

it('calls onRowSelected with the correct index', () => {
  const onRowSelected = jest.fn();

  const wrapper = shallow(
    <SmartTableRow
      cellsMetadata={headCells}
      isCollapseable={false}
      isRowSelected={false}
      item={item}
      rowIndex={0}
      onRowSelected={onRowSelected}
    />
  );

  wrapper.find(TableRow).simulate('click');

  expect(onRowSelected).toHaveBeenCalledWith(0);
});
