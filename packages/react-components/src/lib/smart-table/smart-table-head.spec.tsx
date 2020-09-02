import React from 'react';
import { shallow } from 'enzyme';
import { TableCell, TableSortLabel } from '@material-ui/core';
import { SmartEnhancedTableHead } from './smart-table-head';
import { headCells } from './__mock-data__/smartTableMocks';

it('generates the correct number of table cells', () => {
  const wrapper = shallow(
    <SmartEnhancedTableHead
      headCells={headCells}
      isCollapseable={false}
      onRequestSort={() => {
        // do nothing for eslint
      }}
      order="asc"
      orderBy={''}
    />
  );

  expect(wrapper.find(TableCell)).toHaveLength(headCells.length);

  wrapper.setProps({ isCollapseable: true });

  expect(wrapper.find(TableCell)).toHaveLength(headCells.length + 1);
});

it('sets the correct values for the table cell properties', () => {
  const wrapper = shallow(
    <SmartEnhancedTableHead
      headCells={headCells}
      isCollapseable={false}
      onRequestSort={() => {
        // do nothing for eslint
      }}
      order="asc"
      orderBy={'first'}
    />
  );

  /* eslint-disable @typescript-eslint/no-unsafe-assignment */
  const firstTableCellProps = wrapper
    .findWhere((n) => n.type() === TableCell && n.key() === headCells[0].id)
    .props();
  /* eslint-disable @typescript-eslint/no-unsafe-assignment */
  const secondTableCellProps = wrapper
    .findWhere((n) => n.type() === TableCell && n.key() === headCells[1].id)
    .props();

  expect(firstTableCellProps).toHaveProperty('align', 'left');
  expect(secondTableCellProps).toHaveProperty('align', 'right');

  expect(firstTableCellProps).toHaveProperty('padding', 'none');
  expect(secondTableCellProps).toHaveProperty('padding', 'default');

  expect(firstTableCellProps).toHaveProperty('sortDirection', 'asc');
  expect(secondTableCellProps).toHaveProperty('sortDirection', false);
});

it('sets the correct values for the sort label properties', () => {
  const wrapper = shallow(
    <SmartEnhancedTableHead
      headCells={headCells}
      isCollapseable={false}
      onRequestSort={() => {
        // do nothing for eslint
      }}
      order="desc"
      orderBy={'first'}
    />
  );

  const firstSortLabelProps = wrapper
    .findWhere(
      (n) =>
        n.type() === TableSortLabel && n.prop('children') === headCells[0].label
    )
    .props();
  const secondSortLabelProps = wrapper
    .findWhere(
      (n) =>
        n.type() === TableSortLabel && n.prop('children') === headCells[1].label
    )
    .props();

  expect(firstSortLabelProps).toHaveProperty('active', true);
  expect(secondSortLabelProps).toHaveProperty('active', false);

  expect(firstSortLabelProps).toHaveProperty('direction', 'desc');
  expect(secondSortLabelProps).toHaveProperty('direction', 'asc');
});

it('calls onRequestSort with the correct params', () => {
  const handleRequestSort = jest.fn();

  const wrapper = shallow(
    <SmartEnhancedTableHead
      headCells={headCells}
      isCollapseable={false}
      onRequestSort={handleRequestSort}
      order="desc"
      orderBy={'first'}
    />
  );

  wrapper
    .findWhere(
      (n) =>
        n.type() === TableSortLabel && n.prop('children') === headCells[0].label
    )
    .simulate('click', {});

  expect(handleRequestSort).toHaveBeenCalledWith(
    expect.anything(),
    headCells[0].id
  );
});
