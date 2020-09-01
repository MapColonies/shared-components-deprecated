import React from 'react';
import { number } from '@storybook/addon-knobs';
import { Grid, GridCell } from './';

const cells = Array(24).fill(undefined);
const cellStyle = {
  padding: '16px',
  backgroundColor: '#f2f2f2',
};

export default {
  title: 'Grids',
  component: Grid,
  subcomponents: { GridCell }
};

export const _Grid = () => {
  const span = number('span', 4);
  return (
    <Grid>
      {cells.map((val, i) => (
        <GridCell style={cellStyle} span={span} key={i}>
          {i}
        </GridCell>
      ))}
    </Grid>
  );
};
