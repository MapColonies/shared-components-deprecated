/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import {
  BoundingSphere,
  Cartesian3,
  Cartographic,
  Credit,
  Ellipsoid,
  Math,
  OrientedBoundingBox,
  QuantizedMeshTerrainData,
  Rectangle,
  TerrainProvider,
  TilingScheme,
  WebMercatorTilingScheme
} from 'cesium';
import decode from '@here/quantized-mesh-decoder';
import dummyTileBuffer from './dummy-tile';

export default class QuantizedMeshTerrainProvider {

  private readonly ready: boolean;
  private readonly dummyTile;
  private readonly tilingScheme: TilingScheme;
  private readonly getUrl:(x: number, y: number, level: number) => string;
  private readonly credits: Credit[] | undefined;
  private readonly readyPromise: Promise<boolean>;

  public constructor (options: {
    getUrl?: (x: number, y: number, level: number) => string,
    credit?: string,
    tilingScheme?: TilingScheme,
  }) {
    this.ready = false;
    this.dummyTile = decode(dummyTileBuffer);
    this.tilingScheme = options.tilingScheme ?? new WebMercatorTilingScheme();

    if (options.getUrl === undefined) {
      throw new Error('getUrl option is missing');
    }

    if (options.credit !== undefined) {
      this.credits = [ new Credit(options.credit) ];
    }

    this.getUrl = options.getUrl;

    this.readyPromise = Promise.resolve(true);
    this.ready = true;
  }

  private generateDummyTileHeader (x: number, y: number, level: number): Record<string, number> {
    const tileRect = this.tilingScheme.tileXYToRectangle(x, y, level);
    const tileNativeRect = this.tilingScheme.tileXYToNativeRectangle(x, y, level);
    const tileCenter = Cartographic.toCartesian(Rectangle.center(tileRect));
    const horizonOcclusionPoint = Ellipsoid.WGS84.transformPositionToScaledSpace(tileCenter);

    return {
      centerX: tileCenter.x,
      centerY: tileCenter.y,
      centerZ: tileCenter.z,
      minHeight: 0,
      maxHeight: 0,
      boundingSphereCenterX: tileCenter.x,
      boundingSphereCenterY: tileCenter.y,
      boundingSphereCenterZ: tileCenter.z,
      boundingSphereRadius: tileNativeRect.height,
      horizonOcclusionPointX: horizonOcclusionPoint.x,
      horizonOcclusionPointY: horizonOcclusionPoint.y,
      horizonOcclusionPointZ: horizonOcclusionPoint.z
    };
  }

  private createQuantizedMeshData (decodedTile: any, x: number, y: number, level: number): QuantizedMeshTerrainData {
    const tileRect = this.tilingScheme.tileXYToRectangle(x, y, level);
    const boundingSphereCenter = new Cartesian3(
      decodedTile.header.boundingSphereCenterX,
      decodedTile.header.boundingSphereCenterY,
      decodedTile.header.boundingSphereCenterZ
    );
    const boundingSphere = new BoundingSphere(
      boundingSphereCenter,
      decodedTile.header.boundingSphereRadius
    );
    const horizonOcclusionPoint = new Cartesian3(
      decodedTile.header.horizonOcclusionPointX,
      decodedTile.header.horizonOcclusionPointY,
      decodedTile.header.horizonOcclusionPointZ
    );

    let orientedBoundingBox;

    if (tileRect.width < Math.PI_OVER_TWO + Math.EPSILON5) {
      orientedBoundingBox = OrientedBoundingBox.fromRectangle(
        tileRect,
        decodedTile.header.minHeight,
        decodedTile.header.maxHeight
      );
    }

    return new QuantizedMeshTerrainData({
      minimumHeight: decodedTile.header.minHeight,
      maximumHeight: decodedTile.header.maxHeight,
      quantizedVertices: decodedTile.vertexData,
      indices: decodedTile.triangleIndices,
      boundingSphere: boundingSphere,
      orientedBoundingBox: orientedBoundingBox,
      horizonOcclusionPoint: horizonOcclusionPoint,
      westIndices: decodedTile.westIndices,
      southIndices: decodedTile.southIndices,
      eastIndices: decodedTile.eastIndices,
      northIndices: decodedTile.northIndices,
      westSkirtHeight: 100,
      southSkirtHeight: 100,
      eastSkirtHeight: 100,
      northSkirtHeight: 100,
      childTileMask: 15,
      credits: this.credits
    });
  }

  private generateDummyTile (x: number, y: number, level: number): any {
    return {
      ...this.dummyTile,
      ...this.generateDummyTileHeader(x, y, level)
    };
  }

  private decodeResponse (res: any, x: number, y: number, level: number): any {
    return res.arrayBuffer()
      .then(buffer => {
        return decode(buffer);
      })
      .catch((err) => {
        console.error(`Decoding failed on tile ${this.getUrl(x, y, level)}`);
        console.error(err);

        return this.generateDummyTile(x, y, level);
      });
  }

  private requestTileGeometry (x: number, y: number, level: number): any {
    const url = this.getUrl(x, y, level);

    return window.fetch(url)
      .then(res => {
        if (res.status !== 200) {
          return this.generateDummyTile(x, y, level);
        }

        return this.decodeResponse(res, x, y, level);
      })
      .then(decodedTile => {
        return this.createQuantizedMeshData(decodedTile, x, y, level);
      })
      .catch(err => {
        console.error(err);
      })
  }

  private getTileDataAvailable (x: number, y: number, level: number): boolean {
    return true;
  }

  private getLevelMaximumGeometricError (level: number): number {
    const levelZeroMaximumGeometricError = TerrainProvider
      .getEstimatedLevelZeroGeometricErrorForAHeightmap(
        this.tilingScheme.ellipsoid,
        65,
        this.tilingScheme.getNumberOfXTilesAtLevel(0)
      );

    return levelZeroMaximumGeometricError / (1 << level);
  }
}
