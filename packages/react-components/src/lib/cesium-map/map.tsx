import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from 'react';
import { createPortal } from 'react-dom';
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
import { Proj } from '../utils/projections';
import { CoordinatesTrackerTool } from './tools/coordinates-tracker.tool';
import { ScaleTrackerTool } from './tools/scale-tracker.tool';
import { CesiumSettings, IBaseMap, IBaseMaps } from './settings/settings';
import { IMapLegend, MapLegendSidebar, MapLegendToggle } from './map-legend';
import LayerManager, { LegendExtractor } from './layers-manager';
import { CesiumSceneMode, CesiumSceneModeEnum } from './map.types';

import './map.css';
import { pointToLonLat } from './tools/geojson/point.geojson';

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
  coordinates: { latitude: number, longitude: number };
  style?: Record<string, string>;
  size?: {
    height: number;
    width: number;
  };
  handleClose: () => void;
}

interface ILegends {
  legendsList?: IMapLegend[];
  emptyText?: string;
  title?: string;
  actionsTexts?: { docText: string; imgText: string };
  mapLegendsExtractor?: LegendExtractor;
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
  legends?: ILegends;
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
  const [sceneModes, setSceneModes] = useState<
    CesiumSceneModeEnum[] | undefined
  >();
  const [legendsList, setLegendsList] = useState<IMapLegend[]>([]);
  const [baseMaps, setBaseMaps] = useState<IBaseMaps | undefined>();
  const [showImageryMenu, setShowImageryMenu] = useState<boolean>(false);
  const [imageryMenuPosition, setImageryMenuPosition] = useState<
    Record<string, unknown> | undefined
  >(undefined);
  const [isLegendsSidebarOpen, setIsLegendsSidebarOpen] = useState<boolean>(
    false
  );
  const [rightClickCoordinates, setRightClickCoordinates] = useState<{longitude: number, latitude: number}>();

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

      if (props.imageryContextMenu) {
        viewer.screenSpaceEventHandler.setInputAction(
          (evt: Record<string, unknown>) => {
            // console.log('RIGHT click', evt.position);
            const pos = evt.position as Record<string, unknown>;
            
            setShowImageryMenu(false);
            setImageryMenuPosition(pos);
            setRightClickCoordinates(pointToLonLat(viewer, pos.x as number, pos.y as number));
            setShowImageryMenu(true);
          },
          ScreenSpaceEventType.RIGHT_CLICK
        );
      }
    }
    setMapViewRef(ref.current?.cesiumElement);
  }, [ref, props.imageryContextMenu]);

  useEffect(() => {
    if (mapViewRef) {
      mapViewRef.layersManager = new LayerManager(
        mapViewRef,
        props.legends?.mapLegendsExtractor,
        () => {
          setLegendsList(
            mapViewRef?.layersManager?.legendsList as IMapLegend[]
          );
        }
      );
    }
  }, [mapViewRef]);

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

      const getCameraPositionCartographic = (): ICameraPosition => {
        const camPos = mapViewRef.camera.positionCartographic;
        return {
          longitude: toDegrees(camPos.longitude),
          latitude: toDegrees(camPos.latitude),
          height: camPos.height,
        };
      };

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

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        return pickPositionCartographic !== undefined
          ? {
              longitude: toDegrees(pickPositionCartographic.longitude),
              latitude: toDegrees(pickPositionCartographic.latitude),
              height: mapViewRef.scene.camera.positionCartographic.height,
            }
          : getCameraPositionCartographic();
      } else {
        return getCameraPositionCartographic();
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

  const bindCustomToolsToViewer = useCallback((): JSX.Element | undefined => {
    return (
      mapViewRef &&
      createPortal(
        <>
          <Box className="sideToolsContainer">
            <CesiumSettings
              sceneModes={sceneModes as CesiumSceneModeEnum[]}
              baseMaps={baseMaps}
              locale={locale}
            />
            <MapLegendToggle
              onClick={(): void =>
                setIsLegendsSidebarOpen(!isLegendsSidebarOpen)
              }
            />
          </Box>
          <Box className="toolsContainer">
            {showMousePosition === true ? (
              <CoordinatesTrackerTool projection={projection} />
            ) : (
              <></>
            )}
            {showScale === true ? <ScaleTrackerTool locale={locale} /> : <></>}
          </Box>
        </>,
        document.querySelector('.cesium-viewer') as Element
      )
    );
  }, [
    baseMaps,
    locale,
    mapViewRef,
    projection,
    sceneModes,
    showMousePosition,
    showScale,
    isLegendsSidebarOpen,
  ]);


  return (
    <Viewer className="viewer" full ref={ref} {...viewerProps}>
      <MapViewProvider value={mapViewRef as CesiumViewer}>
        <MapLegendSidebar
          title={props.legends?.title}
          isOpen={isLegendsSidebarOpen}
          toggleSidebar={(): void =>
            setIsLegendsSidebarOpen(!isLegendsSidebarOpen)
          }
          noLegendsText={props.legends?.emptyText}
          legends={props.legends?.legendsList ?? legendsList}
          actionsTexts={props.legends?.actionsTexts}
        />
        {props.children}
        {bindCustomToolsToViewer()}
        {props.imageryContextMenu &&
          showImageryMenu &&
          imageryMenuPosition && 
          rightClickCoordinates &&
          React.cloneElement(props.imageryContextMenu, {
            data: (mapViewRef?.layersManager?.findLayerByPOI(
              imageryMenuPosition.x as number,
              imageryMenuPosition.y as number
            ) as unknown) as Record<string, unknown>[],
            position: {
              x: imageryMenuPosition.x as number,
              y: imageryMenuPosition.y as number,
            },
            coordinates: rightClickCoordinates,
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
          })}
      </MapViewProvider>
    </Viewer>
  );
};
