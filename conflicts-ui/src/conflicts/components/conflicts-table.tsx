import React from 'react';
import { observer } from 'mobx-react-lite';
import { CircularProgress } from '@map-colonies/react-core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { CellMetadata, SmartTable } from '@map-colonies/react-components';
import { useStore } from '../models/rootStore';

import { IConflict } from '../models/conflict';
import { ResponseState } from '../../common/models/ResponseState';
import ConflictItem from './conflict-item';

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    infoContainer: {
      padding: theme.spacing(2),
    },
    infoContent: {
      display: 'block',
      marginRight: 'auto',
      marginLeft: 'auto',
    },
  })
);

const cellsMetaData: CellMetadata<IConflict>[] = [
  {
    disablePadding: false,
    id: 'source_server',
    label: 'Source Server',
    numeric: false,
  },
  {
    disablePadding: false,
    id: 'target_server',
    label: 'Target Server',
    numeric: false,
  },
  {
    disablePadding: false,
    id: 'created_at',
    label: 'Created at',
    numeric: false,
    transform: (c: Date) => c.toLocaleString(),
  },
];

export const ConflictsTable: React.FC = observer(() => {
  const classes = useStyle();
  const { conflictsStore } = useStore();

  if (conflictsStore.state === ResponseState.PENDING) {
    return (
      <div className={classes.infoContainer}>
        <CircularProgress size="xlarge" className={classes.infoContent} />
      </div>
    );
  } else if (conflictsStore.state === ResponseState.ERROR) {
    return (
      <div className={classes.infoContainer}>
        <Typography>
          Something went horribly wrong, please try again later
        </Typography>
      </div>
    );
  } else {
    return (
      <div>
        {
          <SmartTable
            rowsPerPage={conflictsStore.pagination.itemsPerPage as 5 | 10}
            handleChangePage={(e, page) =>
              conflictsStore.pagination.setPage(page)
            }
            handleChangeRowsPerPage={(e) =>
              conflictsStore.pagination.setItemsPerPage(+e.target.value)
            }
            page={conflictsStore.pagination.page}
            count={conflictsStore.pagination.totalItemsCount}
            items={conflictsStore.conflicts as IConflict[]}
            isCollapseable={true}
            collapsedElement={(item) => <ConflictItem conflict={item} />}
            onRequestSort={() => {}}
            cellsMetadata={cellsMetaData}
            onRowSelected={() => {}}
            isDense={true}
          />
        }
      </div>
    );
  }
});
