/* eslint-disable @typescript-eslint/no-magic-numbers */
import {
  IDecodedTile,
  IDecodedTileHeader,
  IExtensions,
} from './quantized-mesh-terrain-provider';

const LITTLE_ENDIAN = true;
const MAX_VERTEX_COUNT = 65536;

export const DECODING_STEPS = {
  header: 0,
  vertices: 1,
  triangleIndices: 2,
  edgeIndices: 3,
  extensions: 4,
};

const QUANTIZED_MESH_HEADER = {
  centerX: Float64Array.BYTES_PER_ELEMENT,
  centerY: Float64Array.BYTES_PER_ELEMENT,
  centerZ: Float64Array.BYTES_PER_ELEMENT,

  minHeight: Float32Array.BYTES_PER_ELEMENT,
  maxHeight: Float32Array.BYTES_PER_ELEMENT,

  boundingSphereCenterX: Float64Array.BYTES_PER_ELEMENT,
  boundingSphereCenterY: Float64Array.BYTES_PER_ELEMENT,
  boundingSphereCenterZ: Float64Array.BYTES_PER_ELEMENT,
  boundingSphereRadius: Float64Array.BYTES_PER_ELEMENT,

  horizonOcclusionPointX: Float64Array.BYTES_PER_ELEMENT,
  horizonOcclusionPointY: Float64Array.BYTES_PER_ELEMENT,
  horizonOcclusionPointZ: Float64Array.BYTES_PER_ELEMENT,
};

const decodeZigZag = (value: number): number => {
  return (value >> 1) ^ -(value & 1);
};

const decodeIndex = (
  buffer: ArrayBufferLike,
  position: number,
  indicesCount: number,
  bytesPerIndex: number,
  encoded: boolean
): Uint16Array | Uint32Array => {
  let indices;

  if (bytesPerIndex === 2) {
    indices = new Uint16Array(buffer, position, indicesCount);
  } else {
    indices = new Uint32Array(buffer, position, indicesCount);
  }

  if (!encoded) {
    return indices;
  }

  let highest = 0;

  for (let i = 0; i < indices.length; ++i) {
    const code = indices[i];

    indices[i] = highest - code;

    if (code === 0) {
      ++highest;
    }
  }

  return indices;
};

const convertFromTypedArrayToNumbersArray = (
  array: Uint16Array | Uint32Array
): number[] => {
  const numbersArray: number[] = [];
  for (let i = 0; i < array.length; ++i) {
    numbersArray.push(array[i]);
  }
  return numbersArray;
};

export const decode = (data: ArrayBufferLike): IDecodedTile => {
  const maxDecodingStep = DECODING_STEPS.extensions;
  const view = new DataView(data);
  const header = {} as IDecodedTileHeader;
  let position = 0;

  // Decode Header

  Object.keys(QUANTIZED_MESH_HEADER).forEach(
    (key: string, bytesCount: number) => {
      // @ts-ignore
      // eslint-disable-next-line
      header[key] =
        bytesCount === 8
          ? view.getFloat64(position, LITTLE_ENDIAN)
          : view.getFloat32(position, LITTLE_ENDIAN);
      position += bytesCount;
    }
  );

  const headerEndPosition = position;

  // if (maxDecodingStep < DECODING_STEPS.vertices) {
  //   return { header };
  // }

  // Decode Vertex Data

  position = headerEndPosition;

  let vertexCount = view.getUint32(position, LITTLE_ENDIAN);

  const vertexData = new Uint16Array(vertexCount * 3);

  position += Uint32Array.BYTES_PER_ELEMENT;

  const bytesPerArrayElement = Uint16Array.BYTES_PER_ELEMENT;
  const elementArrayLength = vertexCount * bytesPerArrayElement;
  const uArrayStartPosition = position;
  const vArrayStartPosition = uArrayStartPosition + elementArrayLength;
  const heightArrayStartPosition = vArrayStartPosition + elementArrayLength;

  let u = 0;
  let v = 0;
  let height = 0;

  for (let i = 0; i < vertexCount; i++) {
    u += decodeZigZag(
      view.getUint16(
        uArrayStartPosition + bytesPerArrayElement * i,
        LITTLE_ENDIAN
      )
    );
    v += decodeZigZag(
      view.getUint16(
        vArrayStartPosition + bytesPerArrayElement * i,
        LITTLE_ENDIAN
      )
    );
    height += decodeZigZag(
      view.getUint16(
        heightArrayStartPosition + bytesPerArrayElement * i,
        LITTLE_ENDIAN
      )
    );

    vertexData[i] = u;
    vertexData[i + vertexCount] = v;
    vertexData[i + vertexCount * 2] = height;
  }

  position += elementArrayLength * 3;

  const vertexDataEndPosition = position;

  // if (maxDecodingStep < DECODING_STEPS.triangleIndices) {
  //   return { header, vertexData };
  // }

  // Decode Triangle Indices

  position = vertexDataEndPosition;

  vertexCount = vertexData.length / 3;

  const bytesPerIndex =
    vertexCount > MAX_VERTEX_COUNT
      ? Uint32Array.BYTES_PER_ELEMENT
      : Uint16Array.BYTES_PER_ELEMENT;

  if (position % bytesPerIndex !== 0) {
    position += bytesPerIndex - (position % bytesPerIndex);
  }

  const triangleCount = view.getUint32(position, LITTLE_ENDIAN);
  position += Uint32Array.BYTES_PER_ELEMENT;

  const triangleIndicesCount = triangleCount * 3;
  const triangleIndices = decodeIndex(
    view.buffer,
    position,
    triangleIndicesCount,
    bytesPerIndex,
    true
  );
  position += triangleIndicesCount * bytesPerIndex;

  const triangleIndicesEndPosition = position;

  // if (maxDecodingStep < DECODING_STEPS.edgeIndices) {
  //   return { header, vertexData, triangleIndices };
  // }

  // Decode Edge Indices

  position = triangleIndicesEndPosition;

  vertexCount = vertexData.length / 3;

  // bytesPerIndex = vertexCount > MAX_VERTEX_COUNT
  //   ? Uint32Array.BYTES_PER_ELEMENT
  //   : Uint16Array.BYTES_PER_ELEMENT;

  const westVertexCount = view.getUint32(position, LITTLE_ENDIAN);
  position += Uint32Array.BYTES_PER_ELEMENT;

  const westIndices = convertFromTypedArrayToNumbersArray(
    decodeIndex(view.buffer, position, westVertexCount, bytesPerIndex, false)
  );
  position += westVertexCount * bytesPerIndex;

  const southVertexCount = view.getUint32(position, LITTLE_ENDIAN);
  position += Uint32Array.BYTES_PER_ELEMENT;

  const southIndices = convertFromTypedArrayToNumbersArray(
    decodeIndex(view.buffer, position, southVertexCount, bytesPerIndex, false)
  );
  position += southVertexCount * bytesPerIndex;

  const eastVertexCount = view.getUint32(position, LITTLE_ENDIAN);
  position += Uint32Array.BYTES_PER_ELEMENT;

  const eastIndices = convertFromTypedArrayToNumbersArray(
    decodeIndex(view.buffer, position, eastVertexCount, bytesPerIndex, false)
  );
  position += eastVertexCount * bytesPerIndex;

  const northVertexCount = view.getUint32(position, LITTLE_ENDIAN);
  position += Uint32Array.BYTES_PER_ELEMENT;

  const northIndices = convertFromTypedArrayToNumbersArray(
    decodeIndex(view.buffer, position, northVertexCount, bytesPerIndex, false)
  );
  position += northVertexCount * bytesPerIndex;

  const edgeIndicesEndPosition = position;

  if (maxDecodingStep < DECODING_STEPS.extensions) {
    return {
      header,
      vertexData,
      triangleIndices,
      westIndices,
      northIndices,
      eastIndices,
      southIndices,
    };
  }

  // Decode Extensions

  const extensions = {} as IExtensions;

  if (view.byteLength > edgeIndicesEndPosition) {
    position = edgeIndicesEndPosition;

    while (position < view.byteLength) {
      const extensionId = view.getUint8(position);
      position += Uint8Array.BYTES_PER_ELEMENT;

      const extensionLength = view.getUint32(position, true);
      position += Uint32Array.BYTES_PER_ELEMENT;

      const extensionView = new DataView(
        view.buffer,
        position,
        extensionLength
      );

      switch (extensionId) {
        case 1: {
          extensions.vertexNormals = new Uint8Array(
            extensionView.buffer,
            extensionView.byteOffset,
            extensionView.byteLength
          );
          break;
        }
        case 2: {
          extensions.waterMask = extensionView.buffer.slice(
            extensionView.byteOffset,
            extensionView.byteOffset + extensionView.byteLength
          );
          break;
        }
        case 4: {
          const jsonLength = extensionView.getUint32(0, LITTLE_ENDIAN);
          let jsonString = '';
          for (let i = 0; i < jsonLength; ++i) {
            jsonString += String.fromCharCode(
              extensionView.getUint8(Uint32Array.BYTES_PER_ELEMENT + i)
            );
          }
          // eslint-disable-next-line
          extensions.metadata = JSON.parse(jsonString);
          break;
        }
        default: {
          console.warn(`Unknown extension with id ${extensionId}`);
        }
      }

      position += extensionLength;
    }
  }

  return {
    header,
    vertexData,
    triangleIndices,
    westIndices,
    northIndices,
    eastIndices,
    southIndices,
    extensions,
  };
};
