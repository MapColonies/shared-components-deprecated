import React, { useState } from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import { BboxCorner, DrawType } from '../../models';
import { CesiumSceneMode } from '../map.types';
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
      coordinates: [],
      name: '',
      id: '',
      type: DrawType.UNKNOWN,
    },
  ]);
  const [center] = useState<[number, number]>([34.9578094, 32.8178637]);

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
      <button
        style={{ position: 'fixed', top: '80px', left: '20px', zIndex: 1 }}
        onClick={(): void => {
          setIsDrawing(false);
          setDrawPrimitive({
            type: DrawType.UNKNOWN,
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            handler: (drawing: IDrawingEvent) => {},
          });
        }}
      >
        Stop Draw
      </button>
      <button
        style={{ position: 'fixed', top: '140px', left: '20px', zIndex: 1 }}
        onClick={(): void => {
          setIsDrawing(false);
          setDrawEntities([
            {
              coordinates: undefined,
              name: `${DrawType.BOX.toString()}_KUKU`,
              id: 'KUKU',
              type: DrawType.BOX,
              geojson: {
                type: 'FeatureCollection',
                features: [
                  {
                    type: 'Feature',
                    properties: {
                      type: BboxCorner.BOTTOM_LEFT,
                    },
                    geometry: {
                      type: 'Point',
                      coordinates: [34.88, 32.72],
                    },
                  },
                  {
                    type: 'Feature',
                    properties: {
                      type: BboxCorner.TOP_RIGHT,
                    },
                    geometry: {
                      type: 'Point',
                      coordinates: [35.02, 32.87],
                    },
                  },
                ],
              },
            },
          ]);
        }}
      >
        Draw rectangle by coordinates
      </button>
      <div style={mapDivStyle}>
        <CesiumMap center={center} sceneMode={CesiumSceneMode.SCENE2D} zoom={9}>
          <CesiumDrawingsDataSource
            drawings={drawEntities}
            drawingMaterial={CesiumColor.RED.withAlpha(0.5)}
            material={CesiumColor.YELLOW.withAlpha(0.5)} //might be supplied if "consumer" want to differintiate between color while drawing and map actual primitive color
            drawingVertexColor={CesiumColor.AQUA}
            drawState={{
              drawing: isDrawing,
              type: drawPrimitive.type,
              handler: drawPrimitive.handler,
            }}
            hollow={args.hollow as boolean}
          />
        </CesiumMap>
      </div>
    </>
  );
};
