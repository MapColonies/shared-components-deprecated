import { PolygonHierarchy, SceneMode } from 'cesium';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const CesiumSceneMode = {
  ...SceneMode,
};

export class CesiumPolygonHierarchy extends PolygonHierarchy {}
