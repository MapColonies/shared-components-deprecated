import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import { Polygon } from 'geojson';
import { PolygonSelectionUi } from './polygon-selection-ui';
import { DrawType } from '../models/enums';
import { ContainerMap } from './container-map';

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    map: {
      height: '100%',
      width: '100%',
      position: 'fixed',
    },
    absolute: {
      position: 'absolute',
      zIndex: 1000,
      left: theme.spacing(1.5),
      top: theme.spacing(1.5),
    },
    contentContainer: {
      marginTop: theme.spacing(1.5),
      width: theme.spacing(80),
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

export const MapFilterContainer: React.FC<MapFilterContainerProps> = (props) => {
  const [drawType, setDrawType] = useState<DrawType>();
  const [selectionPolygon, setSelectionPolygon] = useState<Polygon>();
  const classes = useStyle();

  const onPolygonSelection = (polygon: Polygon) => {
    setSelectionPolygon(polygon);
    setDrawType(undefined);
    props.handlePolygonSelected(polygon);
  };

  const onReset = () => {
    setSelectionPolygon(undefined);
    props.handlePolygonReset();
  };

  return (
    <div className={classes.map}>
      <div className={`${classes.absolute}`}>
        <Paper className={classes.filtersContainer}>
          <PolygonSelectionUi
            onCancelDraw={() => setDrawType(undefined)}
            onReset={onReset}
            onStartDraw={setDrawType}
            isSelectionEnabled={!!drawType}
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
