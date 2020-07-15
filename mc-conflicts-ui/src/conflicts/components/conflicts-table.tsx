import React from "react";
import { useStore } from "../models/rootStore";
import { observer } from "mobx-react-lite";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import ConflictItem from "./conflict-item";
import { IConflict } from "../models/conflictStore";
import { Typography } from "@material-ui/core";
import {CellMetadata, SmartTable} from 'mc-react-components'
const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    infoContainer: {
      padding: theme.spacing(2),
    },
    infoContent: {
      display: "block",
      marginRight: "auto",
      marginLeft: "auto",
    },
  })
);

const cellsMetaData: CellMetadata<IConflict>[] = [
  {
    disablePadding: false,
    id: "source_server",
    label: "Source Server",
    numeric: false,
  },
  {
    disablePadding: false,
    id: "target_server",
    label: "Target Server",
    numeric: false,
  },
  {
    disablePadding: false,
    id: "created_at",
    label: "Created at",
    numeric: false,
    transform: (c: Date) => c.toLocaleString(),
  },
];

export const ConflictsTable: React.FC = observer(() => {
  const classes = useStyle();
  const { conflictsStore } = useStore();

  if (conflictsStore.state === "pending") {
    return (
      <div className={classes.infoContainer}>
        <CircularProgress className={classes.infoContent} />
      </div>
    );
  } else if (conflictsStore.state === "error") {
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
            rowsPerPage={5}
            handleChangePage={() => {}}
            handleChangeRowsPerPage={() => {}}
            page={0}
            count={50}
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
