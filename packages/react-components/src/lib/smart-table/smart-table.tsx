/* eslint-disable */
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  TablePagination,
  Typography,
} from '@material-ui/core';
import { CellMetadata, ElementFunction, Order } from './smart-table-types';
import { SmartEnhancedTableHead } from './smart-table-head';
import { SmartTableRow } from './smart-table-row';

export interface SmartTableProps<T> {
  cellsMetadata: CellMetadata<T>[];
  items: T[];
  onRequestSort: (property: keyof T, order: Order) => void;
  onRowSelected: (index: number) => void;
  isCollapseable: boolean;
  collapsedElement?: ElementFunction<T>;
  isDense?: boolean;
  page: number;
  rowsPerPage: 5 | 10;
  count: number;
  handleChangePage: (event: unknown, newPage: number) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SmartTable<T>(props: SmartTableProps<T>) {
  const [orderBy, setOrderBy] = useState<keyof T | ''>('');
  const [order, setOrder] = useState<Order>('asc');
  const {
    cellsMetadata,
    items,
    onRequestSort,
    onRowSelected,
    isCollapseable,
    collapsedElement,
    isDense,
    page,
    rowsPerPage,
    count,
    handleChangePage,
    handleChangeRowsPerPage,
  } = props;

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof T
  ): void => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    onRequestSort(property, isAsc ? 'desc' : 'asc');
  };

  return (
    <TableContainer component={Paper}>
      <Table size={isDense ? 'small' : 'medium'}>
        <SmartEnhancedTableHead
          headCells={cellsMetadata}
          onRequestSort={handleRequestSort}
          order={order}
          orderBy={orderBy}
          isCollapseable={isCollapseable}
        />
        <TableBody>
          {items.map((item, index) => (
            <SmartTableRow
              key={index}
              item={item}
              rowIndex={index}
              isCollapseable={isCollapseable}
              cellsMetadata={cellsMetadata}
              collapsedElement={collapsedElement}
              isRowSelected={false}
              onRowSelected={onRowSelected}
            />
          ))}
          {(items.length === 0 || rowsPerPage > items.length) && (
            <TableRow
              style={{
                height: (isDense ? 33 : 53) * (rowsPerPage - items.length),
              }}
            >
              <TableCell
                colSpan={
                  isCollapseable
                    ? cellsMetadata.length + 1
                    : cellsMetadata.length
                }
              >
                {items.length === 0 && (
                  <Typography align="center">No results :(</Typography>
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10]}
        component="div"
        count={count}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
}
