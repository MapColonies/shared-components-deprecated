import React from 'react';
import { shallow } from 'enzyme';
import { TableRow } from '@material-ui/core';
import { SmartTable } from './smart-table';
import { headCells, items } from './__mock-data__/smartTableMocks';
import { SmartTableRow } from './smart-table-row';
import { SmartEnhancedTableHead } from './smart-table-head';

const requestSort = jest.fn();

afterEach(() => {
  requestSort.mockClear();
});

it(
  'generates an empty table row if the ' +
    'items array is empty or if the rows per page is bigger',
  () => {
    const wrapper = shallow(
      <SmartTable
        cellsMetadata={headCells}
        count={10}
        handleChangePage={() => {
          // do nothing for eslint
        }}
        handleChangeRowsPerPage={() => {
          // do nothing for eslint
        }}
        isCollapseable={false}
        items={[]}
        onRowSelected={() => {
          // do nothing for eslint
        }}
        onRequestSort={requestSort}
        page={0}
        rowsPerPage={10}
      />
    );

    expect(wrapper.exists(TableRow)).toBe(true);

    wrapper.setProps({ items: new Array(10).map(() => items[0]) });

    expect(wrapper.exists(TableRow)).toBe(false);

    wrapper.setProps({ items: items });

    expect(wrapper.exists(TableRow)).toBe(true);
  }
);

it('Generates a row for each of the items', () => {
  const wrapper = shallow(
    <SmartTable
      cellsMetadata={headCells}
      count={10}
      handleChangePage={() => {
        // do nothing for eslint
      }}
      handleChangeRowsPerPage={() => {
        // do nothing for eslint
      }}
      isCollapseable={false}
      items={items}
      onRowSelected={() => {
        // do nothing for eslint
      }}
      onRequestSort={requestSort}
      page={0}
      rowsPerPage={10}
    />
  );
  const rows = wrapper.find(SmartTableRow);

  expect(rows).toHaveLength(items.length);

  rows.forEach((row, index) => {
    expect(row.props()).toHaveProperty('item', items[index]);
  });
});

it('calls on request sort with the correct order and property when sort is requested', () => {
  const wrapper = shallow(
    <SmartTable
      cellsMetadata={headCells}
      count={10}
      handleChangePage={() => {
        // do nothing for eslint
      }}
      handleChangeRowsPerPage={() => {
        // do nothing for eslint
      }}
      isCollapseable={false}
      items={items}
      onRowSelected={() => {
        // do nothing for eslint
      }}
      onRequestSort={requestSort}
      page={0}
      rowsPerPage={10}
    />
  );

  wrapper
    .find(SmartEnhancedTableHead)
    .simulate('requestSort', {}, headCells[0].id);

  expect(requestSort).toHaveBeenCalledWith(headCells[0].id, 'asc');
  wrapper.update();

  wrapper
    .find(SmartEnhancedTableHead)
    .simulate('requestSort', {}, headCells[0].id);

  expect(requestSort).toHaveBeenCalledWith(headCells[0].id, 'desc');
});
