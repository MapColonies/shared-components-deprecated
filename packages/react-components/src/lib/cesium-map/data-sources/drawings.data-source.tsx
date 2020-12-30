import React, { useEffect, useState } from 'react';
import { Cartesian3, Color, Rectangle, Viewer, PolygonHierarchy } from 'cesium';
import { FeatureCollection, GeoJSON } from 'geojson';
import { CustomDataSourceProps } from 'resium/dist/types/src/CustomDataSource/CustomDataSource';

import { DrawType } from '../../models';
import { CesiumEntity } from '../entities/entity';
import { CesiumEntityStaticDescription } from '../entities/entity.description';
import { CesiumPolygonGraphics } from '../entities/graphics/polygon.graphics';
import { CesiumRectangleGraphics } from '../entities/graphics/rectangle.graphics';
import { useCesiumMap } from '../map';
import { DrawHelper } from '../tools/draw/drawHelper';
import { geoJSONToPrimitive } from '../tools/geojson/geojson-to-primitive';
import { rectangleToGeoJSON, polygonToGeoJSON } from '../tools/geojson';
import { CesiumCustomDataSource } from './custom.data-source';

export class CesiumColor extends Color {}

export type PrimitiveCoordinates = Cartesian3[] | Rectangle | undefined;

export interface IDrawing {
  coordinates: PrimitiveCoordinates;
  name: string;
  id: string;
  type: DrawType;
  geojson?: GeoJSON;
}

export interface IDrawingEvent {
  primitive: PrimitiveCoordinates;
  type: DrawType;
  geojson: GeoJSON;
}

export interface RCesiumDrawingDataSourceProps extends CustomDataSourceProps {
  drawings: IDrawing[];
  drawState: {
    drawing: boolean;
    type: DrawType;
    handler: (drawing: IDrawingEvent) => void;
  };
  drawingMaterial: CesiumColor;
  drawingVertexColor?: CesiumColor;
  material?: CesiumColor;
}

export const CesiumDrawingsDataSource: React.FC<RCesiumDrawingDataSourceProps> = (
  props
) => {
  const { drawState, drawingMaterial, drawingVertexColor, material } = props;
  const mapViewer: Viewer = useCesiumMap();

  const [drawHelper, setDrawHelper] = useState<typeof DrawHelper>();

  useEffect(() => {
    setDrawHelper(
      // eslint-disable-next-line
      new (DrawHelper as any)(mapViewer, drawingMaterial, drawingVertexColor)
    );
  }, []);

  useEffect(() => {
    if (drawHelper) {
      // eslint-disable-next-line
      const drawHelperInstance = drawHelper as any;
      if (drawState.drawing) {
        switch (drawState.type) {
          case DrawType.POLYGON:
            // eslint-disable-next-line
            drawHelperInstance.startDrawingPolygon({
              callback: (positions: PrimitiveCoordinates) => {
                //// MAKE polygon editable example
                // var polygon = new DrawHelper.PolygonPrimitive({
                //   positions: positions,
                //   width: 5,
                //   geodesic: true
                // });
                // mapViewer.scene.primitives.add(polygon);
                // polygon.setStrokeStyle(Color.AQUA,1);
                // polygon.setEditable();
                // polygon.addListener('onEdited', function(event) {
                //   console.log('Polygone edited, ' + event.positions.length + ' points');
                // });
                drawState.handler({
                  primitive: positions,
                  type: DrawType.POLYGON,
                  geojson: polygonToGeoJSON(positions as Cartesian3[]),
                });
              },
            });
            break;
          case DrawType.BOX:
            // eslint-disable-next-line
            drawHelperInstance.startDrawingExtent({
              callback: (positions: PrimitiveCoordinates) => {
                //// MAKE box editable example
                // var extentPrimitive = new DrawHelper.ExtentPrimitive({
                //   extent: positions,
                //   material: Cesium.Material.fromType(Cesium.Material.StripeType)
                // });
                // mapViewer.scene.primitives.add(extentPrimitive);
                // extentPrimitive.setStrokeStyle(Color.AQUA,1);
                // extentPrimitive.setEditable();
                // extentPrimitive.addListener('onEdited', function(event) {
                //   console.log('Extent edited: extent is (N: ' + event.extent.north.toFixed(3) + ', E: ' + event.extent.east.toFixed(3) + ', S: ' + event.extent.south.toFixed(3) + ', W: ' + event.extent.west.toFixed(3) + ')');
                // });
                drawState.handler({
                  primitive: positions,
                  type: DrawType.BOX,
                  geojson: rectangleToGeoJSON(positions as Rectangle),
                });
              },
            });
            break;
          default:
            throw new Error(
              `[CESIUM DRAW]: ${drawState.type} unrecognized primitive to draw.`
            );
            break;
        }
      } else {
        // eslint-disable-next-line
        drawHelperInstance.stopDrawing();
      }
    }
  }, [drawState, drawHelper]);

  const renderGraphicsComponent = (
    drawEntity: IDrawing
  ): React.ReactElement => {
    const coordinates =
      drawEntity.coordinates !== undefined
        ? drawEntity.coordinates
        : geoJSONToPrimitive(
            drawEntity.type,
            drawEntity.geojson as FeatureCollection
          );
    switch (drawEntity.type) {
      case DrawType.BOX:
        return (
          <CesiumRectangleGraphics
            coordinates={coordinates as Rectangle}
            material={material ?? drawingMaterial}
          />
        );
      case DrawType.POLYGON:
        return (
          <CesiumPolygonGraphics
            hierarchy={new PolygonHierarchy(coordinates as Cartesian3[])}
            material={material ?? drawingMaterial}
          />
        );
      default:
        return <></>;
    }
  };

  return (
    <CesiumCustomDataSource {...props}>
      {props.drawings.map((drawEntity, i) => (
        <CesiumEntity key={drawEntity.id} name={drawEntity.name}>
          <CesiumEntityStaticDescription>
            <h1>Drawed Entity {drawEntity.name}</h1>
            <p>This is description of drawed entity</p>
          </CesiumEntityStaticDescription>
          {renderGraphicsComponent(drawEntity)}
        </CesiumEntity>
      ))}
    </CesiumCustomDataSource>
  );
};
