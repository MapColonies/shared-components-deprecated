import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryText,
  ListItemGraphic,
  ListItemPrimaryText,
  ListItemMeta,
} from './';
import './styles';

export default {
  title: 'Lists',
  component: List,
  subcomponents: {
    ListItem,
    ListItemGraphic,
    ListItemMeta,
  },
};

export const _List = () => (
  <List twoLine foundationRef={console.log}>
    <ListItem>
      <ListItemGraphic icon="star_border" />
      <ListItemText>
        <ListItemPrimaryText>Cookies</ListItemPrimaryText>
        <ListItemSecondaryText>$4.99 a dozen</ListItemSecondaryText>
      </ListItemText>
      <ListItemMeta icon="info" />
    </ListItem>
    <ListItem>
      <ListItemGraphic icon="local_pizza" />
      <ListItemText>
        <ListItemPrimaryText>Pizza</ListItemPrimaryText>
        <ListItemSecondaryText>$1.99 a slice</ListItemSecondaryText>
      </ListItemText>
      <ListItemMeta icon="info" />
    </ListItem>
    <ListItem activated>
      <ListItemGraphic icon="mood" />
      <ListItemText>
        <ListItemPrimaryText>Icecream</ListItemPrimaryText>
        <ListItemSecondaryText>$0.99 a scoop</ListItemSecondaryText>
      </ListItemText>
      <ListItemMeta>Winner!</ListItemMeta>
    </ListItem>
  </List>
);
