import React, { useState } from 'react';
import { SmartTable, CellMetadata } from '..';
import { button } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Smart Table',
  component: SmartTable,
};

interface Person {
  firstName: string;
  lastName: string;
  age: number;
  birthday: string;
}

const metadata: CellMetadata<Person>[] = [
  {
    id: "firstName",
    label: "First Name",
    disablePadding: false,
    numeric: false,
  },  
  {
    id: "lastName",
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
    firstName: "Dan",
    lastName: "Walker",
    age: 24,
    birthday: "8-3-1996"
  },
  {
    firstName: "Emily",
    lastName: "Jhonson",
    age: 45,
    birthday: "13-5-1975"
  },
  {
    firstName: "Ron",
    lastName: "Elen",
    age: 13,
    birthday: "7-7-2007"
  },
  {
    firstName: "Michael",
    lastName: "Wall",
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
  const [items, setItems] = useState([...new Array(props.numberOfItems)].map(getRandomPerson));

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
    onRequestSort={action('sort requested')}
    cellsMetadata={metadata}
    onRowSelected={action('row selected')}
    isDense={true}/>
};

export const Small = () => <TableStory numberOfItems={4}/>
export const Large = () => <TableStory numberOfItems={60}/>