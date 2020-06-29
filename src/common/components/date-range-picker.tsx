import React, { useState } from 'react';
import { parseISO, isValid, isBefore } from 'date-fns'

interface DateRangePickerProps {
  onChange?: (dateRange: { from?: Date, to?: Date }) => void
}

export const DateTimeRangePicker: React.FC<DateRangePickerProps> = (props) => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const onChange = () => {
    const fromDate = parseISO(from);
    const toDate = parseISO(to);
    if ((isValid(fromDate) || isValid(toDate)) || ((isValid(fromDate) && isValid(toDate)) && isBefore(fromDate, toDate))) {
      props.onChange?.({ from: isValid(fromDate) ? fromDate : undefined, to: isValid(toDate) ? toDate : undefined })
    }
  }

  return <div>
    <label>from</label><input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
    <label>to</label><input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
    <button onClick={onChange}>set</button>
  </div>
}