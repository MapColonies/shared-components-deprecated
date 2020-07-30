import React, { useState } from 'react';
import { SmartTable, CellMetadata } from '..';
import { button } from '@storybook/addon-knobs';

export default {
  title: 'Smart Table',
  component: SmartTable,
};

interface Person {
  first_name: string;
  last_name: string;
  age: number;
  birthday: string;
}

const metadata: CellMetadata<Person>[] = [
  {
    id: "first_name",
    label: "First Name",
    disablePadding: false,
    numeric: false,
  },  
  {
    id: "last_name",
    label: "Last Name",
    disablePadding: false,
    numeric: false,
  },  
  {
    id: "age",
    label: "Age",
    disablePadding: false,
    numeric: true,
  },  
  {
    id: "birthday",
    label: "Birthday",
    disablePadding: false,
    numeric: false,
  },  
];

const persons:Person[] = [
  {
    first_name: "Dan",
    last_name: "Walker",
    age: 24,
    birthday: "8-3-1996"
  },
  {
    first_name: "Emily",
    last_name: "Jhonson",
    age: 45,
    birthday: "13-5-1975"
  },
  {
    first_name: "Ron",
    last_name: "Elen",
    age: 13,
    birthday: "7-7-2007"
  },
  {
    first_name: "Michael",
    last_name: "Wall",
    age: 60,
    birthday: "28-9-1960"
  }
];

const getRandomPerson = () => persons[Math.floor(Math.random() * persons.length)];

interface TableStroyProps {
  numberOfItems: number;
}

const TableStory: React.FC<TableStroyProps> = (props) => {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [items, setItems] = useState([... new Array(props.numberOfItems)].map(getRandomPerson));

  button("ADD ITEM", () => setItems([...items, getRandomPerson()]));
  button("REMOVE ITEM", () => setItems(items.slice(0, -1))); //remove last
  button("CLEAR TABLE", () => setItems([]));

  return <SmartTable
    rowsPerPage={rowsPerPage as (5 | 10)}
    handleChangePage={(e, newPage) => setPage(newPage)}
    handleChangeRowsPerPage={(e) => setRowsPerPage(+e.target.value)}
    page={page}
    count={items.length}
    items={items}
    isCollapseable={true}
    onRequestSort={() => null}
    cellsMetadata={metadata}
    onRowSelected={() => null}
    isDense={true}/>
};

export const Small = () => <TableStory numberOfItems={4}/>
export const Large = () => <TableStory numberOfItems={60}/>