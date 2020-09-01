import React from 'react';
import { Icon } from './';
import { RMWCProvider } from '../provider';

export default {
  title: 'Icons',
  component: Icon
};

export const _Icon = () => (
  <ul>
    <li>
      Ligature child: <Icon>favorite</Icon>
    </li>
    <li>
      Ligature use: <Icon icon="favorite" />
    </li>
    <li>
      Url child:
      <Icon>https://www2.le.ac.uk/departments/law/images/twitter-follow-us-icon</Icon>
    </li>
    <li>
      Url use: <Icon icon="https://www2.le.ac.uk/departments/law/images/twitter-follow-us-icon" />
    </li>
    <li>
      Component child:{' '}
      <Icon>
        <div style={{ background: 'purple', width: '24px', height: '24px' }} />
      </Icon>
    </li>
    <li>
      Component Use:
      <Icon icon={<div style={{ background: 'purple', width: '24px', height: '24px' }} />} />
    </li>
    <li>
      Nested Icon Child:{' '}
      <Icon>
        <Icon icon={<div style={{ background: 'blue', width: '24px', height: '24px' }} />} />
      </Icon>
    </li>
    <li>
      Nested Icon Use:{' '}
      <Icon
        icon={<Icon icon={<div style={{ background: 'blue', width: '24px', height: '24px' }} />} />}
      />
    </li>
    <li>
      className use:{' '}
      <Icon
        icon={{
          prefix: 'ion-',
          icon: 'ionic',
          strategy: 'className',
          basename: 'icon',
        }}
      />
    </li>
    <li>
      custom use:{' '}
      <Icon
        icon={{
          strategy: 'custom',
          render: (props) => <div>Customized-{props.content}</div>,
          content: 'CUSTOM',
        }}
      />
    </li>
    <li>
      custom with Provider:{' '}
      <RMWCProvider
        icon={{
          strategy: 'custom',
          render: (props) => <div>Custom + {props.content}</div>,
        }}
      >
        <Icon icon="test" />
      </RMWCProvider>
    </li>
  </ul>
);
