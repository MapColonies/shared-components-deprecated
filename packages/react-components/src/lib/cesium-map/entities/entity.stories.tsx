import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Cartesian3, Color } from 'cesium';
import { Story, Meta } from '@storybook/react/types-6-0';
import { action } from '@storybook/addon-actions';
import { CesiumMap } from '../map';
import { CesiumEntity, RCesiumEntityProps } from './entity';
import { CesiumEntityDescription, CesiumEntityStaticDescription } from './entity.description';

export default {
  title: 'Cesium Map/Entity',
  component: CesiumEntity,
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

const mapDivStyle = {
  height: '100%',
  width: '100%',
  position: 'absolute' as const,
};

const initCanvas = () => {
  const can = document.createElement("canvas");
  can.width = 100;
  can.height = 100;
  return can;
};

const renderCanvas = (can: HTMLCanvasElement, p: number) => {
  const c = can.getContext("2d");
  if (!c) return;
  c.clearRect(0, 0, can.width, can.height);
  c.fillStyle = "rgba(100,0,0,0.8)";
  c.beginPath();
  c.arc(can.width / 2, can.height / 2, (p * can.width) / 2, 0, Math.PI * 2, false);
  c.fill();
};

const CanvasEntity: React.FC<RCesiumEntityProps> = props => {
  const c1 = useMemo<HTMLCanvasElement>(initCanvas, []);
  const c2 = useMemo<HTMLCanvasElement>(initCanvas, []);
  const [image, setImage] = useState<HTMLCanvasElement>();
  const progress = useRef(0);

  useEffect(() => {
    const i = window.setInterval(() => {
      progress.current = Math.min(progress.current + 0.01, 1);
      setImage(image => {
        const canvas = image === c1 ? c2 : c1;
        if (canvas) {
          renderCanvas(canvas, progress.current);
        }
        return canvas;
      });
      if (progress.current >= 1) {
        clearInterval(i);
      }
    }, 10);
    return () => window.clearInterval(i);
  }, [c1, c2]);

  return <CesiumEntity {...props} billboard={{ image }} />;
};

export const Basic: Story = (args) => (
  <div style={mapDivStyle}>
    <CesiumMap>
      <CesiumEntity
        {...args}
        name="test"
        description="test!!"
        position={Cartesian3.fromDegrees(-74.0707383, 40.7117244, 100)}
        point={{ pixelSize: 10 }}
      />
    </CesiumMap>
  </div>
);
Basic.storyName = 'Basic Entity';

export const WithDescription: Story<RCesiumEntityProps> = (args) => {
  const [count, setCount] = useState(0);
  return (
    <CesiumMap>
      <CesiumEntity
        {...args}
        name="test1"
        position={Cartesian3.fromDegrees(-74, 40, 100)}
        point={{ pixelSize: 15, color: Color.YELLOW }}
        description="Normal Description"
      />
      <CesiumEntity
        {...args}
        name="test2"
        position={Cartesian3.fromDegrees(-74, 30, 100)}
        point={{ pixelSize: 15, color: Color.BLUE }}>
        <CesiumEntityStaticDescription>
          <h1>Hello!</h1>
          <p>This is description. It can be described with static JSX!</p>
        </CesiumEntityStaticDescription>
      </CesiumEntity>
      <CesiumEntity
        {...args}
        name="test3"
        position={Cartesian3.fromDegrees(-74, 20, 100)}
        point={{ pixelSize: 15, color: Color.RED }}>
        <CesiumEntityDescription>
          <h1>Hello!</h1>
        </CesiumEntityDescription>
      </CesiumEntity>
      <CesiumEntity
        {...args}
        name="test4"
        position={Cartesian3.fromDegrees(-74, 10, 100)}
        point={{ pixelSize: 15, color: Color.ORANGE }}>
        <CesiumEntityDescription>
          <h1>Hello!</h1>
          <p>This is description. It can be described with React!</p>
          <button onClick={() => setCount(i => i + 1)}>counter: {count}</button>
        </CesiumEntityDescription>
      </CesiumEntity>
    </CesiumMap>
  );
};

export const AnimatedCanvas: Story<RCesiumEntityProps> = () => (
  <CesiumMap>
    <CanvasEntity
      name="test"
      description="test"
      position={Cartesian3.fromDegrees(-74.0707383, 40.7117244, 100)}
    />
  </CesiumMap>
);