import React from 'react';
import { Conflict } from '../models/conflict';

interface ConflictItemProps {
  conflict: Conflict
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