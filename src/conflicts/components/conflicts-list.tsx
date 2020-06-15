import React, { useEffect, useCallback } from 'react';
import ConflictItem from './conflict-item';
import { useMst } from '../models/Root';
import { observer } from "mobx-react-lite"
import { IConflict } from '../models/conflict';

const ConflictsList: React.FC = observer(() => {
  // const params = useMemo(() => ({}), []);
  // const [apiResponse, loading, error] = useFetchConflicts(params);
  const { conflictsStore } = useMst(); 

  const onItemSelected = useCallback((conflict: IConflict) => {
    conflictsStore.selectConflict(conflict);
  }, [conflictsStore])
  
  useEffect(() => {
    conflictsStore.fetchConflicts()
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