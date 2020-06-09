import useAxios from 'axios-hooks'
import { Conflict } from '../models/conflict';
import { ApiHttpResponse } from '../../common/models/api-response';
import { AxiosError } from 'axios';
import { useEffect } from 'react';
import { PaginationResult } from '../../common/models/pagination-result';

const apiUrl = 'http://localhost:8000/conflicts'

function useFetchConflicts(params: Object): [PaginationResult<Conflict[]>, boolean, AxiosError | undefined] {

  const [{ data: apiResponse, loading, error }, refetch] = useAxios<ApiHttpResponse<PaginationResult<Conflict[]>>>(
    { url: apiUrl, },
    { manual: true }
  );

  useEffect(() => {
    if (params) {
      refetch({ params })
    }
  }, [params, refetch])

  return [apiResponse?.data, loading, error];
}

export default useFetchConflicts;