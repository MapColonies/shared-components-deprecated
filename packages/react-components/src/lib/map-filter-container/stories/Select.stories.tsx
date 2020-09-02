import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import { PolygonSelectionUi } from '../polygon-selection-ui';
import { DrawType } from '../../models';

export default {
  title: 'Select',
  component: PolygonSelectionUi,
};

export const PolygonBox = () => {
  const [active, setActive] = useState(false);

  const handleStartDraw = (type: DrawType) => {
    setActive(true);
    action('draw started')(type);
  };

  const handleCancelDraw = () => {
    setActive(false);
    action('draw canceled')();
  };

  return (
    <PolygonSelectionUi
      isSelectionEnabled={active}
      onStartDraw={handleStartDraw}
      onCancelDraw={handleCancelDraw}
      onReset={action('cleared')}
    />
  );
};

PolygonBox.story = {
  name: 'Shape',
};
