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
  Viewer as CesiumViewerCls,
  Cartesian3,
  SceneMode,
  Cartesian2,
  Matrix4,
  PerspectiveFrustum,
  PerspectiveOffCenterFrustum,
  OrthographicFrustum,
  ScreenSpaceEventType,
  TerrainProvider,
} from 'cesium';
import { isNumber, isArray } from 'lodash';
import { getAltitude, toDegrees } from '../utils/map';
import { Box } from '../box';
import { CoordinatesTrackerTool } from './tools/coordinates-tracker.tool';
import { ScaleTrackerTool } from './tools/scale-tracker.tool';
import { CesiumSettings, IBaseMap, IBaseMaps } from './settings/settings';
import LayerManager from './layers-manager';
import { CesiumSceneMode, CesiumSceneModeEnum, Proj } from '.';

import './map.css';

const DEFAULT_HEIGHT = 212;
const DEFAULT_WIDTH = 260;
const DEFAULT_DYNAMIC_HEIGHT_INCREMENT = 0;

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
export class CesiumViewer extends CesiumViewerCls {
  public layersManager?: LayerManager;
  public constructor(
    container: string | Element,
    options?: CesiumViewerCls.ConstructorOptions
  ) {
    super(container, options);
  }
}

const mapContext = createContext<CesiumViewer | null>(null);
const MapViewProvider = mapContext.Provider;
const cameraPositionRefreshRate = 10000;

export interface IContextMenuData {
  data: Record<string, unknown>[];
  position: {
    x: number;
    y: number;
  };
  style?: Record<string, string>;
  size?: {
    height: number;
    width: number;
  };
  handleClose: () => void;
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
  terrainProvider?: TerrainProvider;
  imageryContextMenu?: React.ReactElement<IContextMenuData>;
  imageryContextMenuSize?: {
    height: number;
    width: number;
    dynamicHeightIncrement?: number;
  };
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
  const [showImageryMenu, setShowImageryMenu] = useState<boolean>(false);
  const [imageryMenuPosition, setImageryMenuPosition] = useState<Record<string, unknown> | undefined>(undefined);

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

  const getImageryMenuStyle = (
    x: number,
    y: number,
    menuWidth: number,
    menuHeight: number,
    menuDynamicHeightIncrement: number
  ): Record<string, string> => {
    const container = (mapViewRef as CesiumViewer).container;
    const mapWidth = container.clientWidth;
    const mapHeight = container.clientHeight;
    const calculatedHeight = menuHeight + menuDynamicHeightIncrement;
    return {
      left: `${
        mapWidth - x < menuWidth ? x - (menuWidth - (mapWidth - x)) : x
      }px`,
      top: `${
        mapHeight - y < calculatedHeight
          ? y - (calculatedHeight - (mapHeight - y))
          : y
      }px`,
    };
  };

  useEffect(() => {
    if (ref.current) {
      const viewer = ref.current.cesiumElement as CesiumViewer;
      viewer.layersManager = new LayerManager(viewer);
      if (props.terrainProvider) {
        viewer.terrainProvider = props.terrainProvider;
      }
      if (props.imageryContextMenu) {
        viewer.screenSpaceEventHandler.setInputAction(
          (evt: Record<string, unknown>) => {
            // console.log('RIGHT click', evt.position);
            setShowImageryMenu(false);
            setImageryMenuPosition(evt.position as Record<string, unknown>);
            setShowImageryMenu(true);
          },
          ScreenSpaceEventType.RIGHT_CLICK
        );
      }
    }
    setMapViewRef(ref.current?.cesiumElement);
  }, [ref, props.imageryContextMenu, props.terrainProvider]);

  useEffect(() => {
    setSceneModes(
      props.sceneModes ?? [
        CesiumSceneMode.SCENE2D,
        CesiumSceneMode.SCENE3D,
        CesiumSceneMode.COLUMBUS_VIEW,
      ]
    );
  }, [props.sceneModes]);

  useEffect(() => {
    setBaseMaps(props.baseMaps);

    const currentMap = props.baseMaps?.maps.find(
      (map: IBaseMap) => map.isCurrent
    );
    if (currentMap && mapViewRef) {
      mapViewRef.layersManager?.setBaseMapLayers(currentMap);
    }
  }, [props.baseMaps, mapViewRef]);

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

    return (): void => {
      clearInterval(intervalHandle);
    };
  }, [mapViewRef]);

  useEffect(() => {
    const morphCompleteHandler = (): void => {
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
    return (): void => {
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
            locale={locale}
          />
        </Box>
        <Box className="toolsContainer">
          {
            showMousePosition === true ? (
              <CoordinatesTrackerTool
                projection={projection}
              ></CoordinatesTrackerTool>
            ) : (
              <></>
            )
          }
          {showScale === true ? <ScaleTrackerTool locale={locale} /> : <></>}
        </Box>
        {
          props.imageryContextMenu &&
          showImageryMenu &&
          imageryMenuPosition &&
          React.cloneElement(props.imageryContextMenu, {
            data: (mapViewRef?.layersManager?.findLayerByPOI(
              imageryMenuPosition.x as number,
              imageryMenuPosition.y as number
            ) as unknown) as Record<string, unknown>[],
            position: {
              x: imageryMenuPosition.x as number,
              y: imageryMenuPosition.y as number,
            },
            style: getImageryMenuStyle(
              imageryMenuPosition.x as number,
              imageryMenuPosition.y as number,
              props.imageryContextMenuSize?.width ?? DEFAULT_WIDTH,
              props.imageryContextMenuSize?.height ?? DEFAULT_HEIGHT,
              props.imageryContextMenuSize?.dynamicHeightIncrement ??
                DEFAULT_DYNAMIC_HEIGHT_INCREMENT
            ),
            size: props.imageryContextMenuSize ?? {
              height: DEFAULT_HEIGHT,
              width: DEFAULT_WIDTH,
            },
            handleClose: () => {
              setShowImageryMenu(!showImageryMenu);
            },
          })
        }
      </MapViewProvider>
    </Viewer>
  );
};
