import React, { useState } from 'react';
import { PolygonSelectionUi } from '../polygon-selection-ui';

export default {
    title: 'Select',
    component: PolygonSelectionUi,
};

export const PolygonBox = () => {    
    const [active, setActive] = useState(false);

    return <PolygonSelectionUi 
    isSelectionEnabled={active} 
    onStartDraw={() => setActive(true)} 
    onCancelDraw={() => setActive(false)} 
    onReset={() => null}/>;
}

PolygonBox.story = {
    name: 'shape',
};