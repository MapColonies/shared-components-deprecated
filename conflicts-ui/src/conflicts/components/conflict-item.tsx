import React from 'react';

import { IConflict } from '../models/conflict';

interface ConflictItemProps {
  conflict: IConflict;
}

const ConflictItem: React.FC<ConflictItemProps> = ({ conflict }) => {
  return (
    <div>
      <h2>{'#' + conflict.id}</h2>
      <div>{conflict.source_server}</div>
      <div>{conflict.target_server}</div>
      <div>{conflict.description}</div>
    </div>
  );
};

export default ConflictItem;
