import { 
  PolylineDashMaterialProperty,
  ConstantProperty,
  
  VerticalOrigin,
  LabelStyle,
  Cartesian2,
  Cartesian3,
  BoundingSphere,
  Ellipsoid,
  ConstantPositionProperty,
  GeographicTilingScheme
} 
from 'cesium';

// PROXIED CLASSES
export class CesiumPolylineDashMaterialProperty extends PolylineDashMaterialProperty {}

export class CesiumConstantProperty extends ConstantProperty {}

export class CesiumConstantPositionProperty extends ConstantPositionProperty {}

export class CesiumCartesian2 extends Cartesian2 {}

export class CesiumCartesian3 extends Cartesian3 {}

export class CesiumBoundingSphere extends BoundingSphere {}

export class CesiumEllipsoid extends Ellipsoid {}

export class CesiumGeographicTilingScheme extends GeographicTilingScheme {}

// PROXIED ENUMS
// eslint-disable-next-line @typescript-eslint/naming-convention
export const CesiumVerticalOrigin = VerticalOrigin;

// eslint-disable-next-line @typescript-eslint/naming-convention
export const CesiumLabelStyle = LabelStyle;
