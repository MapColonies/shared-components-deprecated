import React from 'react';
import { IConflict } from '../models/conflictStore';
import Typography from '@material-ui/core/Typography';

interface ConflictItemProps {
  conflict: IConflict,
  onSelected?: (conflict: IConflict) => void
}

const ConflictItem: React.FC<ConflictItemProps> = ({ conflict, onSelected }) => {

  return (
    <div>
      <Typography variant="subtitle1">{'#' + conflict.id}</Typography>
      <div>{conflict.source_server}</div>
      <div>{conflict.target_server}</div>
      <div>{conflict.description}</div>
    </div>)
}

export default ConflictItem;
