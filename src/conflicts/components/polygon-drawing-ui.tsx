import React from 'react';
import { useStore } from '../models/rootStore';
import { DrawType } from '../../common/models/enums';

export const PolygonDrawingUi: React.FC = () => {
  const root = useStore();
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