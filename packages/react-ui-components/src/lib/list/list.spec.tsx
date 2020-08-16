import React from 'react';
import { mount } from 'enzyme';
import {
  List,
  ListItem,
  ListItemPrimaryText,
  ListItemGraphic,
  ListItemMeta,
  SimpleListItem,
  CollapsibleList
} from './';

describe('List', () => {
  it('renders', () => {
    const el = mount(
      <List>
        <ListItem ripple>
          <ListItemGraphic />
          <ListItemPrimaryText>Cookies</ListItemPrimaryText>
          <ListItemMeta />
        </ListItem>
        <ListItem ripple={false}>
          <ListItemGraphic />
          <ListItemPrimaryText>Cookies</ListItemPrimaryText>
          <ListItemMeta />
        </ListItem>
      </List>
    );

    el.unmount();
  });

  it('handles onAction', () => {
    let clickedIndex;

    const el = mount(
      <List onAction={(evt) => (clickedIndex = evt.detail)}>
        <ListItem>
          <ListItemPrimaryText>Cookies</ListItemPrimaryText>
        </ListItem>
        <ListItem>
          <ListItemPrimaryText>Cookies</ListItemPrimaryText>
        </ListItem>
      </List>
    );

    el.find(ListItem).last().simulate('click');
    expect(clickedIndex).toEqual({ index: 1 });
  });

  it('SimpleListItem renders', () => {
    mount(
      <List>
        <SimpleListItem graphic="star_border" text="Cookies" />
        <SimpleListItem
          graphic="star_border"
          text="Cookies"
          secondaryText="Chocolate chip"
        />
        <SimpleListItem
          graphic="star_border"
          text="Cookies"
          secondaryText="Chocolate chip"
          meta="info"
        />
      </List>
    );
  });

  it('SimpleListItem can have children', () => {
    const el = mount(
      <SimpleListItem
        graphic="star_border"
        text="Cookies"
        secondaryText="Chocolate chip"
        meta="info"
      >
        <aside>Test</aside>
      </SimpleListItem>
    );
    expect(el.find('aside').length).toBe(1);
  });

  it('can have custom classnames', () => {
    [List, ListItem, ListItemPrimaryText].forEach(
      (Component: React.ComponentType<any>) => {
        const el = mount(<Component className={'my-custom-classname'} />);
        expect(!!~el.html().search('my-custom-classname')).toEqual(true);
      }
    );
  });

  it('can be activated', () => {
    const el = mount(<ListItem activated />);
    expect(!!~el.html().search('mdc-list-item--activated')).toEqual(true);
  });

  it('can be selected', () => {
    const el = mount(<ListItem selected />);
    expect(!!~el.html().search('mdc-list-item--selected')).toEqual(true);
  });

  it('handles events', () => {
    const el = mount(
      <List>
        <SimpleListItem />
        <SimpleListItem />
      </List>
    );

    el.simulate('focus');
    el.find(SimpleListItem).first().simulate('keydown');
    el.simulate('click');
    el.simulate('blur');
  });
});

describe('Collapsible List', () => {
  it('renders', () => {
    mount(
      <List>
        <ListItem>One</ListItem>
        <CollapsibleList handle={<ListItem>Handle</ListItem>}>
          <ListItem>Two</ListItem>
        </CollapsibleList>
      </List>
    );
  });

  it('handles lifecycle', (done) => {
    const el = mount(
      <List>
        <ListItem>One</ListItem>
        <CollapsibleList
          defaultOpen
          handle={<ListItem className="handle">Handle</ListItem>}
        >
          <ListItem>Two</ListItem>
        </CollapsibleList>
      </List>
    );

    el.update();
    setTimeout(() => {
      el.setProps({ open: false });
      el.update();

      el.find('.handle').first().simulate('click');

      done();
    }, 300);
  });

  it('handles events', (done) => {
    const el = mount(
      <List>
        <ListItem>One</ListItem>
        <CollapsibleList
          defaultOpen
          handle={<ListItem className="handle">Handle</ListItem>}
        >
          <ListItem>Two</ListItem>
        </CollapsibleList>
      </List>
    );

    const root = el.find('.rmwc-collapsible-list').first();
    root.simulate('focus');

    const handle = el.find('.handle').first();
    handle.simulate('click');
    handle.simulate('keydown', { which: 13 });
    handle.simulate('keydown', { which: 39 });
    handle.simulate('keydown', { which: 38 });
    handle.simulate('keydown', { which: 40 });
    handle.simulate('keydown', { which: 40, shiftKey: true });
    handle.simulate('keydown', { which: 9 });
    handle.simulate('keydown', { which: 37 });
    handle.simulate('keydown', { which: null });

    setTimeout(() => {
      done();
    }, 500);
  });
});
