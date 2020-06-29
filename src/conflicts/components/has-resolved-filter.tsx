import React from 'react';
import { useStore } from '../models/rootStore';

const options: { [key: string]: boolean | undefined } = { all: undefined, resolved: true, open: false }

export const HasResolvedFilter: React.FC = () => {
  const { conflictsStore } = useStore();

  const onChange = (option: string) => {
    const resolveStatus = options[option];
    conflictsStore.searchParams.setResolved(resolveStatus);
  }

  return (<select onChange={(e) => onChange(e.target.value)}>
    {Object.keys(options).map(key => <option key={key} value={key}>{key}</option>)}
  </select>)
};