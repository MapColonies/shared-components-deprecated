/* eslint-disable */

import { CellMetadata, ElementFunction } from './smart-table-types';
import React, { useState } from 'react';
import { TableRow, TableCell, IconButton, Collapse } from '@material-ui/core';
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from '@material-ui/icons';

interface SmartTableRowProps<T> {
  item: T;
  cellsMetadata: CellMetadata<T>[];
  isRowSelected: boolean;
  rowIndex: number;
  onRowSelected?: (index: number) => void;
  isCollapseable: boolean;
  collapsedElement?: ElementFunction<T>;
}

export function SmartTableRow<T>(props: SmartTableRowProps<T>) {
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

  const handleClick = (): void => {
    onRowSelected?.(rowIndex);
  };
  return (
    <>
      <TableRow hover selected={isRowSelected} onClick={handleClick}>
        {isCollapseable && (
          <TableCell padding="checkbox">
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={(e): void => {
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
            key={(cell.id as string) + rowIndex.toString()}
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
