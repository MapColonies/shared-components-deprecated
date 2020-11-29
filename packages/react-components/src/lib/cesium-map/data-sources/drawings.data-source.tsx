import React, { useEffect, useState } from 'react';
import { Color, Rectangle, Viewer } from 'cesium';
import { CustomDataSourceProps } from 'resium/dist/types/src/CustomDataSource/CustomDataSource';

import { DrawType } from '../../models';
import { CesiumEntity } from '../entities/entity';
import { CesiumEntityStaticDescription } from '../entities/entity.description';
import { CesiumPolygonGraphics } from '../entities/graphics/polygon.graphics';
import { useMap } from '../map';
import { DrawHelper } from '../tools/draw/drawHelper';
import { CesiumCustomDataSource } from './custom.data-source';
import { CesiumRectangleGraphics } from '../entities/graphics/rectangle.graphics';

export interface IDrawing{
  hierarchy: [],
  name: string,
  id: string
}

export interface RCesiumDrawingDataSourceProps extends CustomDataSourceProps {
  drawings: IDrawing[],
  drawState: {
    drawing: boolean,
    type: DrawType,
    handler(positions): any
  }
}

export const CesiumDrawingsDataSource: React.FC<RCesiumDrawingDataSourceProps> = (
  props
) => {
  const { drawState } = props;
  const mapViewer: Viewer = useMap();

  const [drawHelper, setDrawHelper] = useState<any>();
  
  useEffect(() => {
    if (mapViewer) {
      setDrawHelper(new DrawHelper(mapViewer));
    }
  }, [mapViewer]);

  useEffect(() => {
    console.log('drawState.drawing=', drawState.drawing);
    if (drawState.drawing) {
      switch(drawState.type){
        case DrawType.POLYGON:
          drawHelper.startDrawingPolygon({
            callback: (positions) => {
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

              drawState.handler(positions);
            } 
          });
          break;
        case DrawType.BOX:
          drawHelper.startDrawingExtent({
            callback: (positions) => {
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
              drawState.handler(positions);
            } 
          });
          break;
      }
    }
  }, [drawState.drawing, drawState.handler, drawState.type, drawHelper]);

  const renderGraphicsComponent = (drawEntity) => {
    if(drawEntity.hierarchy instanceof Rectangle){
      return (
        <CesiumRectangleGraphics
          coordinates={drawEntity.hierarchy}
          material={Color.YELLOW.withAlpha(0.5)}
          outlineColor={Color.AQUA}
        />
      );
    }
    else {
      return (
        <CesiumPolygonGraphics
          hierarchy={drawEntity.hierarchy}
          // hierarchy={Cartesian3.fromDegreesArray([-108.0, 42.0, -100.0, 42.0, -104.0, 40.0]) as any} // WORKAROUND
          material={Color.YELLOW.withAlpha(0.5)}
          outlineColor={Color.AQUA}
        />);
    }
  };

  return (
  <CesiumCustomDataSource {...props} >

    {props.drawings.map((drawEntity, i) => (
      <CesiumEntity
        key={drawEntity.id} 
        name={drawEntity.name}
      >
        <CesiumEntityStaticDescription>
          <h1>Drawed Polygon</h1>
          <p>This is description of drawed polygon</p>
        </CesiumEntityStaticDescription>
        {renderGraphicsComponent(drawEntity)}
      </CesiumEntity>
    ))}

      
  </CesiumCustomDataSource>
  );
};
