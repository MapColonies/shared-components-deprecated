import React, { useState } from 'react';
import { SmartTable } from '../lib/smart-table';

export default {
  title: 'Table',
  component: SmartTable,
};

export const Smart = () => {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  
  return <SmartTable
    rowsPerPage={rowsPerPage as (5 | 10)}
    handleChangePage={() => setPage(page + 1)}
    handleChangeRowsPerPage={(e) => setRowsPerPage(+e.target.value)}
    page={page}
    count={0}
    items={[]}
    isCollapseable={true}
    onRequestSort={() => null}
    cellsMetadata={[]}
    onRowSelected={() => null}
    isDense={true}></SmartTable>
};

