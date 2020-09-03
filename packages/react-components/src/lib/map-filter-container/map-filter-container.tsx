import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import { Polygon } from 'geojson';
import { DrawType } from '../models/enums';
import { PolygonSelectionUi } from './polygon-selection-ui';
import { ContainerMap } from './container-map';

const PLACEMENT_SPACING_FACTOR = 1.5;
const WIDTH_SPACING_FACTOR = 80;
const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    map: {
      height: '100%',
      width: '100%',
      position: 'absolute',
    },
    absolute: {
      position: 'absolute',
      zIndex: 1000,
      left: theme.spacing(PLACEMENT_SPACING_FACTOR),
      top: theme.spacing(PLACEMENT_SPACING_FACTOR),
    },
    contentContainer: {
      marginTop: theme.spacing(PLACEMENT_SPACING_FACTOR),
      width: theme.spacing(WIDTH_SPACING_FACTOR),
    },
    filtersContainer: {
      display: 'flex',
      padding: theme.spacing(1),
    },
    filtersMargin: {
      marginLeft: theme.spacing(1),
    },
  })
);

export interface MapFilterContainerProps {
  handlePolygonSelected: (polygon: Polygon) => void;
  handlePolygonReset: () => void;
  mapContent?: React.ReactNode;
  filters?: React.ReactNode[];
}

export const MapFilterContainer: React.FC<MapFilterContainerProps> = (
  props
) => {
  const [drawType, setDrawType] = useState<DrawType>();
  const [selectionPolygon, setSelectionPolygon] = useState<Polygon>();
  const classes = useStyle();

  const onPolygonSelection = (polygon: Polygon): void => {
    setSelectionPolygon(polygon);
    setDrawType(undefined);
    props.handlePolygonSelected(polygon);
  };

  const onReset = (): void => {
    setSelectionPolygon(undefined);
    props.handlePolygonReset();
  };

  return (
    <div className={classes.map}>
      <div className={`${classes.absolute}`}>
        <Paper className={classes.filtersContainer}>
          <PolygonSelectionUi
            onCancelDraw={(): void => setDrawType(undefined)}
            onReset={onReset}
            onStartDraw={setDrawType}
            isSelectionEnabled={drawType !== undefined}
          />
          {props.filters?.map((filter, index) => (
            <div key={index} className={classes.filtersMargin}>
              {filter}
            </div>
          ))}
        </Paper>
        <Paper color="red" className={`${classes.contentContainer}`}>
          {props.children}
        </Paper>
      </div>
      <ContainerMap
        children={props.mapContent}
        onPolygonSelection={onPolygonSelection}
        drawType={drawType}
        selectionPolygon={selectionPolygon}
      />
    </div>
  );
};
