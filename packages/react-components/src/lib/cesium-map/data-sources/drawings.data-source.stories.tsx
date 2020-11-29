import React, { useState } from 'react';
import { Cartesian3, Color } from 'cesium';
import { Story, Meta } from '@storybook/react/types-6-0';
import { action } from '@storybook/addon-actions';
import { DrawType } from '../../models';
import { CesiumMap } from '../map';
import { CesiumDrawingsDataSource, IDrawing } from './drawings.data-source';

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

export const Drawings: Story = (args) => {
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [drawPrimitive, setDrawPrimitive] = useState<{type: DrawType, handler: ()=>{}}>();
  const [drawEntities, setDrawEntities] = useState<IDrawing[]>([{
    hierarchy:[],
    name:'',
    id:''
  }]);

  return (
    <>
      <button style={{position: 'fixed', top:'20px', right: '20px', zIndex: 1}} 
              onClick={()=>{
                setIsDrawing(true);
                setDrawPrimitive({
                  type: DrawType.POLYGON,
                  handler: (positions):void => {
                    console.log({name: 'polygonCreated', positions: positions});
        
                    const timeStamp = new Date().getTime().toString();
                    
                    setIsDrawing(false);
        
                    setTimeout(()=>setDrawEntities([{
                      hierarchy: positions,
                      name: `Polygon_${timeStamp}`,
                      id: timeStamp
                    }]),0);
    
                  }
                });
              }}
      >
        Polygon
      </button>
      <button style={{position: 'fixed', top:'50px', right: '20px', zIndex: 1}} 
              onClick={()=>{
                setIsDrawing(true);
                setDrawEntities([]);
                setDrawPrimitive({
                  type: DrawType.BOX,
                  handler: (positions):void => {
                    console.log({name: 'Box', positions: positions});
        
                    const timeStamp = new Date().getTime().toString();
                    
                    setIsDrawing(false);
        
                    setTimeout(()=>setDrawEntities([{
                      hierarchy: positions,
                      name: `Box_${timeStamp}`,
                      id: timeStamp
                    }]),0);
    
                  }
                });
              }}
      >
        Box
      </button>
      <div style={mapDivStyle}>
        <CesiumMap>
          <CesiumDrawingsDataSource 
            drawings={drawEntities}
            drawState={{
              drawing: isDrawing,
              type: drawPrimitive?.type,
              handler: drawPrimitive?.handler
            }}
          />
        </CesiumMap>
      </div>
    </>
  )
};
