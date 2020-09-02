import React from 'react';
import { action } from '@storybook/addon-actions';
import { Switch } from './';
import { useKnob } from '../base/utils/use-knob';

export default {
  title: 'Inputs and Controls',
};

export const _Switch = () => {
  const [checked, setChecked] = useKnob('boolean', 'checked', false);
  const [disabled] = useKnob('boolean', 'disabled', false);
  const [value] = useKnob('text', 'value', 'myValue');
  const [label] = useKnob('text', 'label', 'Hello World');

  return (
    <Switch
      disabled={disabled}
      checked={checked}
      value={value}
      foundationRef={(inst) => console.log(inst)}
      onChange={(evt) => {
        setChecked(evt.currentTarget.checked);
        action(
          `onChange: ${evt.currentTarget.value} ${evt.currentTarget.checked}`
        )();
      }}
      label={label}
    />
  );
};
