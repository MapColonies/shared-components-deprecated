import React, { useEffect, useState } from 'react';
import { Color, Viewer } from 'cesium';
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
    handler: ()=>{}
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
            callback: drawState.handler 
          });
          break;
        case DrawType.BOX:
          drawHelper.startDrawingExtent({
            callback: drawState.handler 
          });
          break;
      }
    }
  }, [drawState.drawing, drawState.handler, drawState.type, drawHelper]);

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
        {drawState.type === DrawType.POLYGON && <CesiumPolygonGraphics
          hierarchy={drawEntity.hierarchy}
          // hierarchy={Cartesian3.fromDegreesArray([-108.0, 42.0, -100.0, 42.0, -104.0, 40.0]) as any} // WORKAROUND
          material={Color.YELLOW.withAlpha(0.5)}
          outlineColor={Color.AQUA}
          />
        }
        {drawState.type === DrawType.BOX && <CesiumRectangleGraphics
          coordinates={drawEntity.hierarchy}
          // hierarchy={Cartesian3.fromDegreesArray([-108.0, 42.0, -100.0, 42.0, -104.0, 40.0]) as any} // WORKAROUND
          material={Color.YELLOW.withAlpha(0.5)}
          outlineColor={Color.AQUA}
          />
        }
      </CesiumEntity>
    ))}

      
  </CesiumCustomDataSource>
  );
};
