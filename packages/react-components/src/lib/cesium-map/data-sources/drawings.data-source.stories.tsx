import React, { useState } from 'react';
import { PolygonHierarchy } from 'cesium';
import { Story, Meta } from '@storybook/react/types-6-0';
import { DrawType } from '../../models';
import { CesiumMap } from '../map';
import {
  CesiumDrawingsDataSource,
  IDrawing,
  IDrawingEvent,
  CesiumColor,
} from './drawings.data-source';

export default {
  title: 'Cesium Map/Entity/Drawing',
  component: CesiumDrawingsDataSource,
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

const mapDivStyle = {
  height: '100%',
  width: '100%',
  position: 'absolute' as const,
};

interface IDrawingObject {
  type: DrawType;
  handler: (drawing: IDrawingEvent) => void;
}

export const Drawings: Story = (args) => {
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [drawPrimitive, setDrawPrimitive] = useState<IDrawingObject>({
    type: DrawType.UNKNOWN,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    handler: (drawing: IDrawingEvent) => {},
  });
  const [drawEntities, setDrawEntities] = useState<IDrawing[]>([
    {
      coordinates: new PolygonHierarchy(),
      name: '',
      id: '',
      type: DrawType.UNKNOWN,
    },
  ]);

  const createDrawPrimitive = (type: DrawType): IDrawingObject => {
    return {
      type: type,
      handler: (drawing: IDrawingEvent): void => {
        const timeStamp = new Date().getTime().toString();

        setIsDrawing(false);

        setDrawEntities([
          {
            coordinates: drawing.primitive,
            name: `${type.toString()}_${timeStamp}`,
            id: timeStamp,
            type: drawing.type,
          },
        ]);
      },
    };
  };

  return (
    <>
      <button
        style={{ position: 'fixed', top: '20px', left: '20px', zIndex: 1 }}
        onClick={(): void => {
          setIsDrawing(true);
          setDrawPrimitive(createDrawPrimitive(DrawType.POLYGON));
        }}
      >
        Polygon
      </button>
      <button
        style={{ position: 'fixed', top: '50px', left: '20px', zIndex: 1 }}
        onClick={(): void => {
          setIsDrawing(true);
          setDrawPrimitive(createDrawPrimitive(DrawType.BOX));
        }}
      >
        Box
      </button>
      <div style={mapDivStyle}>
        <CesiumMap>
          <CesiumDrawingsDataSource
            drawings={drawEntities}
            material={CesiumColor.YELLOW.withAlpha(0.5)}
            outlineColor={CesiumColor.AQUA}
            drawState={{
              drawing: isDrawing,
              type: drawPrimitive.type,
              handler: drawPrimitive.handler,
            }}
          />
        </CesiumMap>
      </div>
    </>
  );
};
