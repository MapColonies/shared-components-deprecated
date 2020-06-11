import React, { useMemo, useEffect } from 'react';
import ConflictItem from './conflict-item';
import useFetchConflicts from '../hooks/useFetchConflicts';
import { useMst } from '../models/Root';
import { observer } from "mobx-react-lite"

const ConflictsList = observer(() => {
  // const params = useMemo(() => ({}), []);
  // const [apiResponse, loading, error] = useFetchConflicts(params);
  const { conflicts } = useMst();

  useEffect(() => {
    conflicts.fetchConflicts()
  }, [])
  if (conflicts.state === 'pending') {
    return <div>loading...</div>
  } else if (conflicts.state === 'error') {
    return <div>error!</div>
  } else {
    return (<div>
      {conflicts.conflicts.map((conflict) => (<ConflictItem key={conflict.id} conflict={conflict} />))}
    </div>)
  }
})

export default ConflictsList