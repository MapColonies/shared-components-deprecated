import React from 'react';
import { IConflict } from '../models/conflict';

interface ConflictItemProps {
  conflict: IConflict
}

function ConflictItem(props: ConflictItemProps) {
  return (
    <div>
      <div>{props.conflict.source_server}</div>
      <div>{props.conflict.target_server}</div>
      <div>{props.conflict.description}</div>
      <hr />
    </div>)
}

export default ConflictItem