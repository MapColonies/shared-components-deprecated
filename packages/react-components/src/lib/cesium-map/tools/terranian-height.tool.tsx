import React, { ChangeEvent } from 'react';
import {
  Cartesian2,
  Ellipsoid,
  Color as CesiumColor,
  LabelStyle as CesiumLabelStyle,
  VerticalOrigin as CesiumVerticalOrigin,
  Cartographic,
  sampleTerrainMostDetailed,
} from 'cesium';
import { CesiumViewer, useCesiumMap } from '../map';

interface IParsedData {
  cartographic: Cartographic;
  cartesian: Cartesian2;
}

const LABEL_PIXEL_OFFSET = -25;
const FIRST_DATA_ROW_IDX = 2;

export interface TerrainianHeightProps {}

export const TerrainianHeightTool: React.FC<TerrainianHeightProps> = (
  props
) => {
  const mapViewer: CesiumViewer = useCesiumMap();

  const csvToArray = (str: string, delimiter = ','): IParsedData[] => {
    // const headers = str.slice(0, str.indexOf('\n')).split(delimiter);
    const rows = str.slice(str.indexOf('\n') + 1).split('\n');

    const arr = rows.map((row) => {
      const values = row.split(delimiter);
      const el = Cartographic.fromDegrees(
        parseFloat(values[0]),
        parseFloat(values[1])
      );
      // const el = headers.reduce((object: Record<string, number>, header, index) => {
      //   const trimmedHeader = header.trim();
      //   object[trimmedHeader] = parseFloat(values[index]);
      //   return object;
      // }, {});

      //return el;
      return {
        cartographic: el,
        cartesian: new Cartesian2(parseFloat(values[0]), parseFloat(values[1])),
      };
    });

    return arr;
  };

  const loadCSV = (evt: ChangeEvent<HTMLInputElement>): void => {
    evt.preventDefault();
    evt.persist();
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>): any => {
      const text = e.target?.result;
      const parsed = csvToArray(text as string);
      const ellipsoid = Ellipsoid.WGS84;

      console.log('Loaded CSV content:\n', text);

      void sampleTerrainMostDetailed(
        mapViewer.terrainProvider,
        parsed.map((item) => item.cartographic)
      ).then(
        (updatedPositions) => {
          console.log(updatedPositions);
          updatedPositions = updatedPositions.slice(
            0,
            updatedPositions.length - 1
          ); // UNIX brake line

          mapViewer.scene.globe.depthTestAgainstTerrain = true;
          mapViewer.entities.suspendEvents();
          mapViewer.entities.removeAll();

          updatedPositions.forEach((position, idx) => {
            mapViewer.entities.add({
              name: (idx + FIRST_DATA_ROW_IDX).toString(),
              position: ellipsoid.cartographicToCartesian(position),
              billboard: {
                verticalOrigin: CesiumVerticalOrigin.BOTTOM,
                scale: 0.7,
                image: 'assets/img/map-marker.gif',
              },
              label: {
                text: (idx + FIRST_DATA_ROW_IDX).toString(),
                font: '14pt monospace',
                fillColor: CesiumColor.BLACK,
                style: CesiumLabelStyle.FILL_AND_OUTLINE,
                outlineWidth: 4,
                outlineColor: CesiumColor.BLACK,
                verticalOrigin: CesiumVerticalOrigin.BOTTOM,
                pixelOffset: new Cartesian2(0, LABEL_PIXEL_OFFSET),
              },
              description: `
                Long: ${parsed[idx].cartesian.x} </br>
                Lat: ${parsed[idx].cartesian.y} </br>
                Height(m): <span style="font-weight: 500">${position.height}</span>
              `,
            });
          });

          mapViewer.entities.resumeEvents();

          if (evt.target.files !== null) {
            exportToCsv(
              `terranian_heights_${evt.target.files[0].name}`,
              parsed
            );
            evt.target.value = '';
          }

          console.log(
            'Pinned point count is ',
            mapViewer.entities.values.length
          );
        },
        (err) => {
          console.error('ERROR while sampleTerrainMostDetailed:', err);
        }
      );
    };

    if (evt.target.files?.[0]) {
      reader.readAsText(evt.target.files[0]);
    }
  };

  const exportToCsv = (filename: string, rows: IParsedData[]): void => {
    const processRow = (row: IParsedData): string => {
      let finalVal = '';
      finalVal += row.cartesian.x.toString() + ',';
      finalVal += row.cartesian.y.toString() + ',';
      finalVal += row.cartographic.height.toString();
      return finalVal + '\n';
    };

    let csvFile = 'long,lat,height\n';
    rows.forEach((row) => {
      csvFile += processRow(row);
    });

    const blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <input
        type="file"
        id="csvFile"
        accept=".csv"
        onChange={(e: ChangeEvent<HTMLInputElement>): void => {
          loadCSV(e);
        }}
      />
    </>
  );
};
