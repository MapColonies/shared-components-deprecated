import React from 'react';
import { mount } from 'enzyme';
import { Grid, GridCell, GridRow } from './';

describe('Grid', () => {
  it('renders', () => {
    const grid = mount(<Grid />);
    const gridCell = mount(<GridCell />);
    expect(!!~grid.html().search('mdc-layout-grid')).toEqual(true);
    expect(!!~gridCell.html().search('mdc-layout-grid__cell')).toEqual(true);
  });

  it('can be fixedColumnWidth', () => {
    mount(<Grid fixedColumnWidth />);
  });

  it('automatically renders inner grid', () => {
    const el = mount(<Grid />);
    expect(el.html().includes('mdc-layout-grid__inner')).toBe(true);
  });

  it('can have a custom GridRow component', () => {
    const el = mount(
      <Grid>
        <GridRow />
      </Grid>
    );
    expect((el.html().match(/mdc-layout-grid__inner/g) || []).length).toBe(1);
  });

  it('can be align', () => {
    mount(<Grid align="left" />);
    mount(<Grid align="right" />);
  });

  it('GridCell span', () => {
    mount(<GridCell span={4} />);
  });

  it('GridCell phone', () => {
    mount(<GridCell phone={4} />);
  });

  it('GridCell tablet', () => {
    mount(<GridCell tablet={4} />);
  });

  it('GridCell desktop', () => {
    mount(<GridCell desktop={4} />);
  });

  it('GridCell order', () => {
    mount(<GridCell order={4} />);
  });

  it('GridCell align', () => {
    mount(<GridCell align="top" />);
  });

  it('can have custom classnames', () => {
    [Grid, GridCell].forEach((Component: React.ComponentType<any>) => {
      const el = mount(<Component className={'my-custom-classname'} />);
      expect(!!~el.html().search('my-custom-classname')).toEqual(true);
    });
  });
});
