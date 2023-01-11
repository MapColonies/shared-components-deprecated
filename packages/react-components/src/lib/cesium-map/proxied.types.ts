import {
  BoundingSphere,
  Cartesian2,
  Cartesian3,
  Cartographic,
  CesiumTerrainProvider,
  ConstantPositionProperty,
  ConstantProperty,
  Ellipsoid,
  EllipsoidTerrainProvider,
  GeographicTilingScheme,
  LabelStyle,
  PolylineDashMaterialProperty,
  Rectangle,
  Resource,
  VerticalOrigin,
  Math,
} from 'cesium';

// PROXIED CLASSES
export class CesiumPolylineDashMaterialProperty extends PolylineDashMaterialProperty {}

export class CesiumConstantProperty extends ConstantProperty {}

export class CesiumConstantPositionProperty extends ConstantPositionProperty {}

export class CesiumCartesian2 extends Cartesian2 {}

export class CesiumCartesian3 extends Cartesian3 {}

export class CesiumCartographic extends Cartographic {}

export class CesiumBoundingSphere extends BoundingSphere {}

export class CesiumEllipsoid extends Ellipsoid {}

export class CesiumGeographicTilingScheme extends GeographicTilingScheme {}

export class CesiumRectangle extends Rectangle {}

export class CesiumResource extends Resource {}

export class CesiumEllipsoidTerrainProvider extends EllipsoidTerrainProvider {}

export class CesiumCesiumTerrainProvider extends CesiumTerrainProvider {}

// PROXIED ENUMS
// eslint-disable-next-line @typescript-eslint/naming-convention
export const CesiumVerticalOrigin = VerticalOrigin;

// eslint-disable-next-line @typescript-eslint/naming-convention
export const CesiumLabelStyle = LabelStyle;

// PROXIED FUNCTIONS
export {
  sampleTerrainMostDetailed as cesiumSampleTerrainMostDetailed,
  Math as CesiumMath,
} from 'cesium';
