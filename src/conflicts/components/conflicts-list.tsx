import React, { useMemo } from 'react';
import ConflictItem from './conflict-item';
import useFetchConflicts from '../hooks/useFetchConflicts';

const ConflictsList = () => {
  const params = useMemo(() => ({}), []);
  const [apiResponse, loading, error] = useFetchConflicts(params);
  
  if (loading) {
    return <div>loading...</div>
  } else if (error) {
    return <div>error!</div>
  } else {
    return (<div>
      {apiResponse?.data?.map((conflict) => (<ConflictItem key={conflict.id} conflict={conflict} />))}
    </div>)
  }
}

export default ConflictsList