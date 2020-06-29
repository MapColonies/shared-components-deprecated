import React from 'react'
import { DateTimeRangePicker } from '../../common/components/date-range-picker'
import { useStore } from '../models/rootStore';

export const DateFilter: React.FC = () => {
  const { conflictsStore } = useStore();
  return <div>
    <DateTimeRangePicker onChange={({ from, to }) => conflictsStore.searchParams.setDateRange(from, to)} />
  </div>;
}

