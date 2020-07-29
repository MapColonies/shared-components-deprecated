import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { ContainerMap } from '../lib/map-filter-container/container-map';
import { MapFilterContainer } from '../lib/map-filter-container/map-filter-container';

export default {
  title: 'Map',
  component: ContainerMap,
};

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    map: {
      height: '100%',
      width: '100%',
      position: 'fixed',
    },
  })
);

export const Basic = () => {
  const classes = useStyle();

  return <div className={classes.map}>
    <ContainerMap onPolygonSelection={() => null}>
    </ContainerMap>
  </div>
};

export const withDrawer = () => <MapFilterContainer handlePolygonReset={() => null} handlePolygonSelected={() => null}></MapFilterContainer>;

withDrawer.story = {
  name: 'with Drawer',
};

