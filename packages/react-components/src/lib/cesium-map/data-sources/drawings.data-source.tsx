import React, { useEffect, useState } from 'react';
import { Color, PolygonHierarchy, Rectangle, Viewer } from 'cesium';
import { CustomDataSourceProps } from 'resium/dist/types/src/CustomDataSource/CustomDataSource';

import { DrawType } from '../../models';
import { CesiumEntity } from '../entities/entity';
import { CesiumEntityStaticDescription } from '../entities/entity.description';
import { CesiumPolygonGraphics } from '../entities/graphics/polygon.graphics';
import { CesiumRectangleGraphics } from '../entities/graphics/rectangle.graphics';
import { useMap } from '../map';
import { DrawHelper } from '../tools/draw/drawHelper';
import { CesiumCustomDataSource } from './custom.data-source';

export class CesiumColor extends Color {}

export type PrimitiveCoordinates = PolygonHierarchy | Rectangle;

export interface IDrawing {
  coordinates: PrimitiveCoordinates;
  name: string;
  id: string;
  type: DrawType;
}

export interface IDrawingEvent {
  primitive: PrimitiveCoordinates;
  type: DrawType;
}

export interface RCesiumDrawingDataSourceProps extends CustomDataSourceProps {
  drawings: IDrawing[];
  drawState: {
    drawing: boolean;
    type: DrawType;
    handler: (drawing: IDrawingEvent) => void;
  };
  material: CesiumColor;
  outlineColor: CesiumColor;
}

export const CesiumDrawingsDataSource: React.FC<RCesiumDrawingDataSourceProps> = (
  props
) => {
  const { drawState, material, outlineColor } = props;
  const mapViewer: Viewer = useMap();

  const [drawHelper, setDrawHelper] = useState<typeof DrawHelper>();

  useEffect(() => {
    // eslint-disable-next-line
    setDrawHelper(new (DrawHelper as any)(mapViewer));
  }, [mapViewer]);

  useEffect(() => {
    if (drawState.drawing && drawHelper) {
      switch (drawState.type) {
        case DrawType.POLYGON:
          // eslint-disable-next-line
          (drawHelper as any).startDrawingPolygon({
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
              });
            },
          });
          break;
        case DrawType.BOX:
          // eslint-disable-next-line
          (drawHelper as any).startDrawingExtent({
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
              });
            },
          });
          break;
        default:
          break;
      }
    }
  }, [drawState, drawHelper]);

  const renderGraphicsComponent = (
    drawEntity: IDrawing
  ): React.ReactElement => {
    switch (drawEntity.type) {
      case DrawType.BOX:
        return (
          <CesiumRectangleGraphics
            coordinates={drawEntity.coordinates as Rectangle}
            material={material}
            outlineColor={outlineColor}
          />
        );
      case DrawType.POLYGON:
        return (
          <CesiumPolygonGraphics
            hierarchy={drawEntity.coordinates as PolygonHierarchy}
            // hierarchy={Cartesian3.fromDegreesArray([-108.0, 42.0, -100.0, 42.0, -104.0, 40.0]) as any} // WORKAROUND
            material={material}
            outlineColor={outlineColor}
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
