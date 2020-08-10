import React from 'react';
// import { Menu, MenuItem, Button } from '@material-ui/core';
// import Tooltip from '@material-ui/core/Tooltip';
import { Menu, MenuItem, Button, Tooltip } from '@map-colonies/react-core/dist';
import '@map-colonies/react-core/dist/button/styles';
import '@map-colonies/react-core/dist/tooltip/styles';
import '@map-colonies/react-core/dist/menu/styles';


import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import { DrawType } from '../models/enums';
import { Box } from '../box';

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    drawingButton: {
      width: theme.spacing(18),
    },
    fullWidth: {
      width: '100%',
      marginTop: '36px'
    },
  })
);

export interface PolygonSelectionUiProps {
  isSelectionEnabled: boolean;
  onStartDraw: (type: DrawType) => void;
  onCancelDraw: () => void;
  onReset: () => void;
}

export const PolygonSelectionUi: React.FC<PolygonSelectionUiProps> = (
  props
) => {
  const classes = useStyle();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { isSelectionEnabled, onCancelDraw, onStartDraw, onReset } = props;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  if (isSelectionEnabled) {
    return (
      <Tooltip 
        content="Cancel the ongoing draw"
        align={'bottomLeft'}
      >
        <Button
          className={classes.drawingButton}
          raised
          onClick={onCancelDraw}
        >
          Cancel Draw
        </Button>
      </Tooltip>
    );
  } else {
    return (
      <Box position="relative"> 
        <Tooltip 
          content="draw an Area of interest to limit the search" 
          align={'bottomLeft'}
        >
          <Button
            className={classes.drawingButton}
            raised
            onClick={handleClick}
          >
            Draw AOI
          </Button>
        </Tooltip>
        <Menu
          className={classes.fullWidth}
          open={Boolean(anchorEl)}
          // keepMounted
          onClose={handleClose}
          // anchorEl={anchorEl}
          // getContentAnchorEl={null}
          // anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          // transformOrigin={{
          //   vertical: 'top',
          //   horizontal: 'center',
          // }}
        >
          <MenuItem
            onClick={() => {
              onStartDraw(DrawType.polygon);
              handleClose();
            }}
          >
            Polygon
          </MenuItem>
          <MenuItem
            onClick={() => {
              onStartDraw(DrawType.box);
              handleClose();
            }}
          >
            Box
          </MenuItem>
          <MenuItem
            onClick={() => {
              onReset();
              handleClose();
            }}
          >
            Clear
          </MenuItem>
        </Menu>
      </Box>
    );
  }
};
