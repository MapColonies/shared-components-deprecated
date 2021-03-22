import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from 'react';
import { Viewer, CesiumComponentRef } from 'resium';
import { ViewerProps } from 'resium/dist/types/src/Viewer/Viewer';
import {
  Viewer as CesiumViewer,
  Cartesian3,
  SceneMode,
  Cartesian2,
  Matrix4,
  PerspectiveFrustum,
  PerspectiveOffCenterFrustum,
  OrthographicFrustum,
} from 'cesium';
import { isNumber, isArray } from 'lodash';

import { getAltitude, toDegrees } from '../utils/map';
import { Box } from '../box';
import './map.css';
import { CoordinatesTrackerTool } from './tools/coordinates-tracker.tool';
import { ScaleTrackerTool } from './tools/scale-tracker.tool';
import { CesiumSettings, IBaseMaps } from './settings/settings';
import LayerManager from './layers-manager';
import { CesiumSceneMode, CesiumSceneModeEnum, Proj } from '.';

const mapContext = createContext<CesiumViewer | null>(null);
const MapViewProvider = mapContext.Provider;
const cameraPositionRefreshRate = 10000;
interface ICameraPosition {
  longitude: number;
  latitude: number;
  height: number | undefined;
}

interface ICameraState {
  position: ICameraPosition;
  direction?: Cartesian3;
  up?: Cartesian3;
  right?: Cartesian3;
  transform?: Matrix4;
  frustum?:
    | PerspectiveFrustum
    | PerspectiveOffCenterFrustum
    | OrthographicFrustum;
}

export interface CesiumMapProps extends ViewerProps {
  showMousePosition?: boolean;
  showScale?: boolean;
  projection?: Proj;
  center?: [number, number];
  zoom?: number;
  locale?: { [key: string]: string };
  sceneModes?: CesiumSceneModeEnum[];
  baseMaps?: IBaseMaps;

}

export const useCesiumMap = (): CesiumViewer => {
  const mapViewer = useContext(mapContext);

  if (mapViewer === null) {
    throw new Error('map context is null, please check the provider');
  }

  return mapViewer;
};

export const CesiumMap: React.FC<CesiumMapProps> = (props) => {
  const ref = useRef<CesiumComponentRef<CesiumViewer>>(null);
  const [mapViewRef, setMapViewRef] = useState<CesiumViewer>();
  const [projection, setProjection] = useState<Proj>();
  const [showMousePosition, setShowMousePosition] = useState<boolean>();
  const [showScale, setShowScale] = useState<boolean>();
  const [locale, setLocale] = useState<{ [key: string]: string }>();
  const [cameraState, setCameraState] = useState<ICameraState | undefined>();
  const [sceneModes, setSceneModes] = useState<CesiumSceneModeEnum[] | undefined>();
  const [baseMaps, setBaseMaps] = useState<IBaseMaps | undefined>();

  const viewerProps = {
    fullscreenButton: true,
    timeline: false,
    animation: false,
    baseLayerPicker: false,
    geocoder: false,
    navigationHelpButton: false,
    homeButton: false,
    sceneModePicker: false,
    ...(props as ViewerProps),
  };

  const getCameraPosition = (): ICameraPosition => {
    if (mapViewRef === undefined) {
      return {
        longitude: 0,
        latitude: 0,
        height: 0,
      };
    }
    // https://stackoverflow.com/questions/33348761/get-center-in-cesium-map
    if (mapViewRef.scene.mode === SceneMode.SCENE3D) {
      const windowPosition = new Cartesian2(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        mapViewRef.container.clientWidth / 2,
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        mapViewRef.container.clientHeight / 2
      );
      const pickRay = mapViewRef.scene.camera.getPickRay(windowPosition);
      const pickPosition = mapViewRef.scene.globe.pick(
        pickRay,
        mapViewRef.scene
      );
      const pickPositionCartographic = mapViewRef.scene.globe.ellipsoid.cartesianToCartographic(
        pickPosition as Cartesian3
      );
      return {
        longitude: toDegrees(pickPositionCartographic.longitude),
        latitude: toDegrees(pickPositionCartographic.latitude),
        height: mapViewRef.scene.camera.positionCartographic.height,
      };
    } else {
      const camPos = mapViewRef.camera.positionCartographic;
      return {
        longitude: toDegrees(camPos.longitude),
        latitude: toDegrees(camPos.latitude),
        height: camPos.height,
      };
    }
  };

  useEffect(() => {
    if (ref.current){
      (ref.current.cesiumElement as any).layersManager = new LayerManager(ref.current.cesiumElement);
    }
    setMapViewRef(ref.current?.cesiumElement);
  }, [ref]);

  useEffect(() => {
    setSceneModes(props.sceneModes ?? [CesiumSceneMode.SCENE2D, CesiumSceneMode.SCENE3D, CesiumSceneMode.COLUMBUS_VIEW]);
  }, [props.sceneModes]);

  useEffect(() => {
    setBaseMaps(props.baseMaps);
  }, [props.baseMaps]);


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
    const intervalHandle = setInterval(() => {
      if (mapViewRef && mapViewRef.scene.mode !== SceneMode.MORPHING) {
        const camera = mapViewRef.camera;

        const store: ICameraState = {
          position: getCameraPosition(),
          direction: camera.direction.clone(),
          up: camera.up.clone(),
          right: camera.right.clone(),
          transform: camera.transform.clone(),
          frustum: camera.frustum.clone(),
        };
        setCameraState(store);
      }
    }, cameraPositionRefreshRate);

    return () => {
      clearInterval(intervalHandle);
    };
  }, [mapViewRef]);

  useEffect(() => {
    const morphCompleteHandler = () => {
      if (mapViewRef && cameraState) {
        void mapViewRef.camera.flyTo({
          destination: Cartesian3.fromDegrees(
            cameraState.position.longitude,
            cameraState.position.latitude,
            cameraState.position.height
          ),
          duration: 0,
        });
      }
    };
    if (mapViewRef) {
      mapViewRef.scene.morphComplete.addEventListener(morphCompleteHandler);
    }
    return () => {
      if (mapViewRef) {
        mapViewRef.scene.morphComplete.removeEventListener(
          morphCompleteHandler
        );
      }
    };
  }, [mapViewRef, cameraState]);

  useEffect(() => {
    const zoom = props.zoom;
    const center = props.center;
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
  }, [props.zoom, props.center, mapViewRef]);

  return (
    <Viewer full ref={ref} {...viewerProps}>
      <MapViewProvider value={mapViewRef as CesiumViewer}>
        {props.children}
        <Box className="sideToolsContainer">
          <CesiumSettings 
            sceneModes={sceneModes as CesiumSceneModeEnum[]}
            baseMaps={baseMaps}
          />
        </Box>
        <Box className="toolsContainer">
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
