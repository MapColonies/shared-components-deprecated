/* eslint-disable */

import React from 'react';
import TableHead from '@material-ui/core/TableHead';
import { CellMetadata, Order } from './smart-table-types';
import { TableRow, TableCell, TableSortLabel } from '@material-ui/core';

interface SmartTableHeadProps<T> {
  headCells: CellMetadata<T>[];
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof T) => void;
  order: Order;
  orderBy: keyof T | '';
  isCollapseable: boolean;
}

export function SmartEnhancedTableHead<T>(props: SmartTableHeadProps<T>) {
  const { headCells, order, orderBy, onRequestSort, isCollapseable } = props;
  const createSortHandler = (property: keyof T) => (
    event: React.MouseEvent<unknown>
  ) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {isCollapseable && <TableCell />}
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id as string}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
