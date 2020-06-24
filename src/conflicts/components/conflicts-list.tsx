import React, { useCallback } from 'react';
import ConflictItem from './conflict-item';
import { useStore } from '../models/rootStore';
import { observer } from "mobx-react-lite"
import { IConflict } from '../models/conflictStore';

const ConflictsList: React.FC = observer(() => {
  // const params = useMemo(() => ({}), []);
  // const [apiResponse, loading, error] = useFetchConflicts(params);
  const { conflictsStore } = useStore();

  const onItemSelected = useCallback((conflict: IConflict) => {
    conflictsStore.selectConflict(conflict);
  }, [conflictsStore])
  if (conflictsStore.state === 'pending') {
    return <div>loading...</div>
  } else if (conflictsStore.state === 'error') {
    return <div>error!</div>
  } else {
    return (<div>
      {conflictsStore.conflicts.map((conflict) => (<ConflictItem onSelected={onItemSelected} key={conflict.id} conflict={conflict} />))}
    </div>)
  }
})

export default ConflictsList