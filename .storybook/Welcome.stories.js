import React from 'react';
import { Typography } from '@map-colonies/react-core/dist/typography';
import '@map-colonies/react-core/dist/typography/styles';

export default {
  title: 'Welcome'
};

export const ToCatalog = () => <div>
  <Typography tag="div" style={{ margin: '16px 0' }} use="headline3">
    Welcome to Map Colonies Catalog
  </Typography><br/>
  <Typography tag="div" style={{ margin: '16px 0' }} use="subtitle1">
    Shared components for Map Colonies organization.
  </Typography>
</div>;

ToCatalog.story = {
  name: 'to Catalog',
};
