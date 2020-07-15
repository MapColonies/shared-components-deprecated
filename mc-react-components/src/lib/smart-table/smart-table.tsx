import React, { useState } from 'react';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  TableSortLabel,
  IconButton,
  TablePagination,
  Typography,
} from '@material-ui/core';

export type Order = 'asc' | 'desc';
export type ElementFunction<T> = (item: T) => JSX.Element;

export interface CellMetadata<T> {
  disablePadding: boolean;
  id: keyof T;
  label: string;
  numeric: boolean;
  transform?: (value: T[keyof T]) => string;
}
interface TableHeadProps<T> {
  headCells: CellMetadata<T>[];
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof T) => void;
  order: Order;
  orderBy: keyof T | '';
  isCollapseable: boolean;
}

function EnhancedTableHead<T>(props: TableHeadProps<T>) {
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

interface RowProps<T> {
  item: T;
  cellsMetadata: CellMetadata<T>[];
  isRowSelected: boolean;
  rowIndex: number;
  onRowSelected?: (index: number) => void;
  isCollapseable: boolean;
  collapsedElement?: ElementFunction<T>;
}

function Row<T>(props: RowProps<T>) {
  const {
    cellsMetadata,
    isRowSelected,
    item,
    onRowSelected,
    rowIndex,
    isCollapseable,
    collapsedElement,
  } = props;
  const [open, setOpen] = useState(false);
  const cellCount = cellsMetadata.length;

  const handleClick = () => {
    onRowSelected?.(rowIndex);
  };
  return (
    <>
      <TableRow hover selected={isRowSelected} onClick={handleClick}>
        {isCollapseable && (
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(!open);
              }}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        )}
        {cellsMetadata.map((cell) => (
          <TableCell
            key={(cell.id as string) + rowIndex}
            align={cell.numeric ? 'right' : 'left'}
            padding={cell.disablePadding ? 'none' : 'default'}
          >
            {cell.transform ? cell.transform(item[cell.id]) : item[cell.id]}
          </TableCell>
        ))}
      </TableRow>
      {isCollapseable && (
        <TableRow>
          <TableCell
            style={{ paddingBottom: 0, paddingTop: 0 }}
            colSpan={cellCount + 1}
          >
            <Collapse in={open} unmountOnExit timeout="auto">
              {collapsedElement?.(item)}
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

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
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    onRequestSort(property, order);
  };

  return (
    <TableContainer component={Paper}>
      <Table size={isDense ? 'small' : 'medium'}>
        <EnhancedTableHead
          headCells={cellsMetadata}
          onRequestSort={handleRequestSort}
          order={order}
          orderBy={orderBy}
          isCollapseable={isCollapseable}
        />
        <TableBody>
          {items.map((item, index) => (
            <Row
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
          {(items.length === 0 || rowsPerPage > items.length) && <TableRow style={{ height: (isDense ? 33 : 53) * (rowsPerPage - items.length) }}>
            <TableCell
              colSpan={
                isCollapseable ? cellsMetadata.length + 1 : cellsMetadata.length
              }
            >
              {items.length === 0 && <Typography align='center'>No results :(</Typography>}
            </TableCell>
          </TableRow>}
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
