import React from 'react';
// import { Select, MenuItem } from '@material-ui/core';

// Import from react web component wrapper
// import { MwcSelect as Select, MwcMenuItem as MenuItem} from '@map-colonies/ui-components-react/dist';

// Import from react core components
import { Select, MenuItem } from '@map-colonies/react-core/dist';
import '@map-colonies/react-core/dist/select/styles';

import { observer } from 'mobx-react-lite';
import { useStore } from '../models/rootStore';

const options: { [key: string]: boolean | undefined } = {
  all: undefined,
  resolved: true,
  open: false,
};

export const HasResolvedFilter: React.FC = observer(() => {
  const { conflictsStore } = useStore();
  const { searchParams } = conflictsStore;

  const onChange = (option: string) => {
    const resolveStatus = options[option];
    searchParams.setResolved(resolveStatus);
  };

  return (
    // <FormControl>
    //   <InputLabel id="resolved-label">resolve status</InputLabel>
  

    // <Select
    //   value={Object.keys(options).find(
    //     (key) => options[key] === searchParams.resolved
    //   )}
    //   onChange={(e) => onChange(e.target.value as string)}
    // >
    //   {Object.keys(options).map((key) => (
    //     <MenuItem key={key} value={key}>
    //       {key}
    //     </MenuItem>
    //   ))}
    // </Select>

    // <Select
    //   onChange={(e:any) => onChange(e.target.value as string)}
    // >
    //   {Object.keys(options).map((key) => (
    //     <MenuItem key={key}>
    //       {key}
    //     </MenuItem>
    //   ))}
    // </Select>

    <Select
      options={Object.keys(options).map((key) => key)}
      onChange={(e:any) => onChange(e.target.value as string)}
    >
    </Select>

// </FormControl>
  );
});
