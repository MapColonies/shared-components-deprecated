import { ConflictSearchParams } from './conflict-search-params';
import { Geometry } from 'geojson';

const geom: Geometry = {
  type: 'Polygon',
  coordinates: [
    [
      [0, 0],
      [0, 1],
      [1, 1],
      [1, 0],
      [0, 0],
    ],
  ],
};

it('isDateRangeValid returns true when both dates are undefined', () => {
  const store = ConflictSearchParams.create({});

  expect(store.isDateRangeValid).toEqual(true);
});

it('isDateRangeValid returns true if only one date is defined', () => {
  const store = ConflictSearchParams.create({ from: new Date() });

  expect(store.isDateRangeValid).toEqual(true);
});

it('isDateRangeValid returns false if both dates are defined, but from > to', () => {
  const store = ConflictSearchParams.create({
    from: new Date(1595222000),
    to: new Date(1595221000),
  });

  expect(store.isDateRangeValid).toBe(false);
});

it('isDateRangeValid returns false if both dates are defined, and from is before to', () => {
  const store = ConflictSearchParams.create({
    from: new Date(1595222000),
    to: new Date(1595223000),
  });

  expect(store.isDateRangeValid).toBe(true);
});

it('setLocation updates the geojson in the store', () => {
  const store = ConflictSearchParams.create({});

  store.setLocation(geom);

  expect(store.geojson).toEqual(geom);
});

it('setDateRange updates the dates in the store', () => {
  const store = ConflictSearchParams.create({});
  const from = new Date();
  const to = new Date();

  store.setDateRange(from, to);

  expect(store.from).toBe(from);
  expect(store.to).toBe(to);
});

it('setResolved updates resolved in the store', () => {
  const store = ConflictSearchParams.create({});

  store.setResolved(true);

  expect(store.resolved).toBe(true);
});

it('setKeywords replaces the keywords in the store', () => {
  const store = ConflictSearchParams.create({});
  const keywords = ['a', 'b', 'c'];

  store.setKeywords(keywords);

  expect(store.keywords).toEqual(keywords);
});

it('resetLocation sets geojson to be undefined', () => {
  const store = ConflictSearchParams.create({geojson: geom})

  store.resetLocation();

  expect(store.geojson).toBeUndefined();
})