export type Order = 'asc' | 'desc';
export type ElementFunction<T> = (item: T) => JSX.Element;

export interface CellMetadata<T> {
  disablePadding: boolean;
  id: keyof T;
  label: string;
  numeric: boolean;
  transform?: (value: T[keyof T]) => string;
}
