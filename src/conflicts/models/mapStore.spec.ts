import { ConflictMapState } from './mapStore';
import { DrawType } from '../../common/models/enums';
import { Geometry } from '@turf/helpers';


it('start draw action should set the draw state to the correct value', () => {
  const store = ConflictMapState.create({});

  store.startDraw(DrawType.box);

  expect(store.drawState === DrawType.box);
});

it('save the geometry and reset the draw state on setGeometry', () => {
  const geometry: Geometry = { type: 'point', coordinates: [] };
  const store = ConflictMapState.create({});

  store.setGeometry(geometry);

  expect(store.currentGeometry).toBe(geometry);
  expect(store.drawState).toBeNull();
})

it('reset the state when resetState action is called', () => {
  const store = ConflictMapState.create({});

  store.resetState();

  expect(store.currentGeometry).toBeNull();
  expect(store.drawState).toBeNull();
}); 