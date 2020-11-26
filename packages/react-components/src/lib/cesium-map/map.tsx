import React, { createContext, useContext, useEffect, useState } from 'react';
import { Viewer } from 'resium';
import { Viewer as CesiumViewer, Cartesian3 } from 'cesium';
import { isNumber, isArray } from 'lodash';

import { CesiumComponentRef } from 'resium';
import { useRef } from 'react';
import { getAltitude } from '../utils/map';
import { Box } from '../box';
import './map.css';
import { CoordinatesTrackerTool } from './tools/coordinates-tracker.tool';
import { ScaleTrackerTool } from './tools/scale-tracker.tool';
import { Proj } from '.';

import {
  GroundPrimitive, GeometryInstance, RectangleGeometry, Rectangle, EllipsoidSurfaceAppearance, ClassificationType,
  Matrix4, Transforms, ColorGeometryInstanceAttribute, Color, PerInstanceColorAppearance, EllipsoidGeometry, VertexFormat, Primitive 
} from 'cesium';

import { DrawHelper } from './tools/draw/drawHelper';
import { CesiumEntity } from './entities/entity';
import { CesiumEntityStaticDescription } from './entities/entity.description';
import { CesiumPolygonGraphics } from './entities/graphics/polygon.graphics';

const mapContext = createContext<CesiumViewer | null>(null);
const MapViewProvider = mapContext.Provider;

export interface MapProps {
  allowFullScreen?: boolean;
  showMousePosition?: boolean;
  showScale?: boolean;
  projection?: Proj;
  center?: [number, number];
  zoom?: number;
  locale?: { [key: string]: string };
}

export const useMap = (): CesiumViewer => {
  const mapViewer = useContext(mapContext);

  if (mapViewer === null) {
    throw new Error('map context is null, please check the provider');
  }

  return mapViewer;
};

export const CesiumMap: React.FC<MapProps> = (props) => {
  const ref = useRef<CesiumComponentRef<CesiumViewer>>(null);
  const [mapViewRef, setMapViewRef] = useState<CesiumViewer>();
  const [projection, setProjection] = useState<Proj>();
  const [showMousePosition, setShowMousePosition] = useState<boolean>();
  const [showScale, setShowScale] = useState<boolean>();
  const [locale, setLocale] = useState<{ [key: string]: string }>();

  const [drawHelper, setDrawHelper] = useState<any>();

  useEffect(() => {
    setMapViewRef(ref.current?.cesiumElement);
  }, [ref]);

  useEffect(() => {
    setProjection(props.projection ?? Proj.WGS84);
  }, [props.projection]);

  useEffect(() => {
    setLocale(props.locale);
  }, [props.locale]);

  useEffect(() => {
    setShowMousePosition(props.showMousePosition ?? true);
  }, [props.showMousePosition]);

  useEffect(() => {
    setShowScale(props.showScale ?? true);
  }, [props.showScale]);

  useEffect(() => {
    const { zoom, center } = props;
    if (mapViewRef && isNumber(zoom) && isArray(center)) {
      void mapViewRef.camera.flyTo({
        destination: Cartesian3.fromDegrees(
          center[0],
          center[1],
          getAltitude(zoom)
        ),
        duration: 0,
      });
    }
  }, [props, mapViewRef]);

  useEffect(() => {
    if (mapViewRef) {
      setDrawHelper(new DrawHelper(mapViewRef));
    }
  }, [mapViewRef]);

  const [drawEntityPosition, setDrawEntityPosition] = useState<any>();

  return (
    <Viewer
      full={props.allowFullScreen ?? true}
      ref={ref}
      timeline={false}
      animation={false}
      baseLayerPicker={false}
      geocoder={false}
      navigationHelpButton={false}
      homeButton={false}
    >
      <button style={{position: 'fixed', top:'20px', left: '20px'}} onClick={()=>{
        // const rectangleInstance = new GeometryInstance({
        //   geometry : new RectangleGeometry({
        //     rectangle : Rectangle.fromDegrees(-140.0, 30.0, -100.0, 40.0),
        //     vertexFormat : PerInstanceColorAppearance.VERTEX_FORMAT
        //   }),
        //   id : 'rectangle',
        //   attributes : {
        //     color : new ColorGeometryInstanceAttribute(0.0, 1.0, 1.0, 0.5)
        //   }
        // });
        // const ellipsoidInstance = new GeometryInstance({
        //   geometry : new EllipsoidGeometry({
        //     radii : new Cartesian3(500000.0, 500000.0, 1000000.0),
        //     vertexFormat : VertexFormat.POSITION_AND_NORMAL
        //   }),
        //   modelMatrix : Matrix4.multiplyByTranslation(Transforms.eastNorthUpToFixedFrame(
        //     Cartesian3.fromDegrees(-95.59777, 40.03883)), new Cartesian3(0.0, 0.0, 500000.0), new Matrix4()),
        //   id : 'ellipsoid',
        //   attributes : {
        //     color : ColorGeometryInstanceAttribute.fromColor(Color.AQUA)
        //   }
        // });
        // mapViewRef?.scene.primitives.add(new Primitive({
        //   geometryInstances : [rectangleInstance, ellipsoidInstance],
        //   appearance : new PerInstanceColorAppearance()
        // }));

        drawHelper.startDrawingPolygon({
          callback: function(positions) {
              console.log({name: 'polygonCreated', positions: positions});

              // setDrawEntityPosition(positions);
              
              // var polyline = new DrawHelper.PolylinePrimitive({
              //   positions: positions,
              //   width: 5,
              //   geodesic: true
              // });
              // mapViewRef?.scene.primitives.add(polyline);
              // polyline.setEditable();
              // polyline.addListener('onEdited', function(event) {
              //   console.log('Polyline edited, ' + event.positions.length + ' points');
              // });

              var polygon = new DrawHelper.PolygonPrimitive({
                positions: positions,
                width: 5,
                geodesic: true
              });
              mapViewRef?.scene.primitives.add(polygon);
              polygon.setStrokeStyle(Color.AQUA,1);
              polygon.setEditable();
              polygon.addListener('onEdited', function(event) {
                console.log('Polygone edited, ' + event.positions.length + ' points');
              });

          }
      });
      }}>RECtangle</button>
      <MapViewProvider value={mapViewRef as CesiumViewer}>
        {props.children}
        <CesiumEntity
          name="test"
        >
          <CesiumEntityStaticDescription>
            <h1>Hello!</h1>
            <p>This is description. It can be described with static JSX!</p>
          </CesiumEntityStaticDescription>
          <CesiumPolygonGraphics
            hierarchy={drawEntityPosition}
            // hierarchy={Cartesian3.fromDegreesArray([-108.0, 42.0, -100.0, 42.0, -104.0, 40.0]) as any} // WORKAROUND
            material={Color.GREEN}
          />
        </CesiumEntity>
        <Box className="toolsContainer" display="flex">
          {showMousePosition === true ? (
            <CoordinatesTrackerTool
              projection={projection}
            ></CoordinatesTrackerTool>
          ) : (
            <></>
          )}
          {showScale === true ? <ScaleTrackerTool locale={locale} /> : <></>}
        </Box>
      </MapViewProvider>
    </Viewer>
  );
};
