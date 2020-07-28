import React from 'react';
import { Menu, MenuItem, Button } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import { DrawType } from '../models/enums';

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    drawingButton: {
      width: theme.spacing(18),
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
      <Tooltip title="Cancel the ongoing draw">
        <Button
          className={classes.drawingButton}
          variant="outlined"
          onClick={onCancelDraw}
        >
          Cancel Draw
        </Button>
      </Tooltip>
    );
  } else {
    return (
      <div>
        <Tooltip title="draw an Area of interest to limit the search">
          <Button
            className={classes.drawingButton}
            variant="outlined"
            onClick={handleClick}
          >
            Draw AOI
          </Button>
        </Tooltip>
        <Menu
          open={Boolean(anchorEl)}
          keepMounted
          onClose={handleClose}
          anchorEl={anchorEl}
          getContentAnchorEl={null}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
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
      </div>
    );
  }
};
