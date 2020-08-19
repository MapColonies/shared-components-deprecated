import { CellMetadata } from '../smart-table-types';

export interface Item {
  first: string;
  second: number;
}

export const headCells: CellMetadata<Item>[] = [
  {
    disablePadding: true,
    id: 'first',
    label: 'first',
    numeric: false,
    transform: jest.fn().mockReturnValue('42'),
  },
  { disablePadding: false, id: 'second', label: 'second', numeric: true },
];

export const items: Item[] = [
  { first: 'a', second: 1 },
  { first: 'b', second: 2 },
];
