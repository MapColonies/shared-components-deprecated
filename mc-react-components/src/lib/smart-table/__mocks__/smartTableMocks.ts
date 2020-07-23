import { CellMetadata } from '../smart-table-types';

export interface item {
  first: string;
  second: number;
}

export const headCells: CellMetadata<item>[] = [
  { disablePadding: true, id: 'first', label: 'first', numeric: false, transform: jest.fn().mockReturnValue('42') },
  { disablePadding: false, id: 'second', label: 'second', numeric: true },
];

export const items: item[] = [
  { first: 'a', second: 1 },
  { first: 'b', second: 2 },
];
