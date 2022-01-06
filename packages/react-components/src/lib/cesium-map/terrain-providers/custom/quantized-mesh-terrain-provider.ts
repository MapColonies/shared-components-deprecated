/* eslint-disable @typescript-eslint/no-explicit-any */
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
  WebMercatorTilingScheme,
} from 'cesium';
import decode from '@here/quantized-mesh-decoder';
import dummyTileBuffer from './dummy-quantized-mesh-tile';

const TILE_IMAGE_WIDTH = 65;

export interface IDecodedTileHeader {
  centerX: number;
  centerY: number;
  centerZ: number;
  minHeight: number;
  maxHeight: number;
  boundingSphereCenterX: number;
  boundingSphereCenterY: number;
  boundingSphereCenterZ: number;
  boundingSphereRadius: number;
  horizonOcclusionPointX: number;
  horizonOcclusionPointY: number;
  horizonOcclusionPointZ: number;
}

export interface IExtensions {
  vertexNormals?: Uint8Array;
  waterMask?: ArrayBufferLike;
  metadata?: unknown;
}

export interface IDecodedTile {
  header: IDecodedTileHeader;
  vertexData: Uint16Array;
  triangleIndices: Uint16Array | Uint32Array;
  westIndices: number[];
  northIndices: number[];
  eastIndices: number[];
  southIndices: number[];
  extensions?: IExtensions;
}

export default class QuantizedMeshTerrainProvider /*extends TerrainProvider*/ {
  public tilingScheme: TilingScheme;
  public ready: boolean;
  public readyPromise: Promise<boolean>;
  private readonly dummyTile: IDecodedTile;
  private readonly getUrl: (x: number, y: number, level: number) => string;
  private readonly credits: Credit[] | undefined;

  public constructor(options: {
    getUrl?: (x: number, y: number, level: number) => string;
    credit?: string;
    tilingScheme?: TilingScheme;
  }) {
    // super();
    this.ready = false;
    this.dummyTile = decode(dummyTileBuffer);
    this.tilingScheme = options.tilingScheme ?? new WebMercatorTilingScheme();

    if (options.getUrl === undefined) {
      throw new Error('getUrl option is missing');
    }

    if (options.credit !== undefined) {
      this.credits = [new Credit(options.credit)];
    }

    this.getUrl = options.getUrl;

    this.readyPromise = Promise.resolve(true);
    this.ready = true;
  }

  public requestTileGeometry(
    x: number,
    y: number,
    level: number
  ): Promise<void | QuantizedMeshTerrainData> | undefined {
    const url = this.getUrl(x, y, level);

    return window
      .fetch(url)
      .then((res: Response) => {
        if (res.status !== 200) {
          return this.generateDummyTile(x, y, level);
        }
        return this.decodeResponse(res, x, y, level);
      })
      .then((decodedTile: IDecodedTile) => {
        return this.createQuantizedMeshData(decodedTile, x, y, level);
      })
      .catch((err: unknown) => {
        console.error(err);
      });
  }

  public getTileDataAvailable(x: number, y: number, level: number): boolean {
    return true;
  }

  public getLevelMaximumGeometricError(level: number): number {
    const levelZeroMaximumGeometricError = TerrainProvider.getEstimatedLevelZeroGeometricErrorForAHeightmap(
      this.tilingScheme.ellipsoid,
      TILE_IMAGE_WIDTH,
      this.tilingScheme.getNumberOfXTilesAtLevel(0)
    );

    return levelZeroMaximumGeometricError / (1 << level);
  }

  private generateDummyTileHeader(
    x: number,
    y: number,
    level: number
  ): IDecodedTileHeader {
    const tileRect = this.tilingScheme.tileXYToRectangle(x, y, level);
    const tileNativeRect = this.tilingScheme.tileXYToNativeRectangle(
      x,
      y,
      level
    );
    const tileCenter = Cartographic.toCartesian(Rectangle.center(tileRect));
    const horizonOcclusionPoint = Ellipsoid.WGS84.transformPositionToScaledSpace(
      tileCenter
    );

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
      horizonOcclusionPointZ: horizonOcclusionPoint.z,
    };
  }

  private createQuantizedMeshData(
    decodedTile: IDecodedTile,
    x: number,
    y: number,
    level: number
  ): QuantizedMeshTerrainData {
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
      credits: this.credits,
    });
  }

  private generateDummyTile(x: number, y: number, level: number): IDecodedTile {
    return {
      ...this.dummyTile,
      ...this.generateDummyTileHeader(x, y, level),
    };
  }

  private decodeResponse(
    res: any,
    x: number,
    y: number,
    level: number
  ): IDecodedTile {
    return res
      .arrayBuffer()
      .then((buffer: ArrayBufferLike) => {
        return decode(buffer);
      })
      .catch((err: unknown) => {
        console.error(`Decoding failed on tile ${this.getUrl(x, y, level)}`);
        console.error(err);

        return this.generateDummyTile(x, y, level);
      });
  }
}
