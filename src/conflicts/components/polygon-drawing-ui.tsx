import React from 'react';
import { useMst } from '../models/Root';
import { DrawType } from '../../common/components/ol-map/interactions/draw';

export const PolygonDrawingUi: React.FC = () => {
  const root = useMst();
  return (<div>
    <button onClick={() => {
      root.mapStore.startDraw(DrawType.polygon);
    }}>polygon</button>
    <button onClick={() => {
      root.mapStore.startDraw(DrawType.box);
    }}>box</button>
    <button onClick={() => {
      root.mapStore.resetState();
    }}>cancel</button>
  </div>)
};