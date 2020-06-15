import React, { useCallback } from 'react';
import { IConflict } from '../models/conflict';

interface ConflictItemProps {
  conflict: IConflict,
  onSelected?: (conflict: IConflict) => void
}

const ConflictItem: React.FC<ConflictItemProps> = ({ conflict, onSelected }) => {
  const handleSelection = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    onSelected?.(conflict);
  }, [conflict, onSelected])
  return (
    <div onClick={handleSelection}>
      <div>{conflict.source_server}</div>
      <div>{conflict.target_server}</div>
      <div>{conflict.description}</div>
      <hr />
    </div>)
}

export default ConflictItem;
