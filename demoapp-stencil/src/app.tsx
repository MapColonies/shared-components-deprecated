import * as React from 'react';

import { DateTimeRangePicker } from '@map-colonies/react-components';
import { MwcButton } from '@map-colonies/ui-components-react/dist';

import { HomePage } from './features/home/home-page';

export class App extends React.Component<{}, {}> {
  public render() {
    return (
      <div>
        <HomePage />
        <DateTimeRangePicker
          onChange={(e) => {
            console.log(e);
          }}
        />

        <MwcButton raised={true} color="primary">
          KUKU
        </MwcButton>
      </div>
    );
  }
}
