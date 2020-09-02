import React from 'react';
import { action } from '@storybook/addon-actions';
import { useKnob } from '../base/utils/use-knob';
import { Checkbox } from './';
import { Radio } from '../radio';
import { Slider } from '../slider';
import { Switch } from '../switch';

export default {
  title: 'Inputs and Controls',
  component: Checkbox,
  subcomponents: { Radio, Slider, Switch },
};

export const _CheckBox = () => {
  const [checked, setChecked] = useKnob('boolean', 'checked', false);
  const [indeterminate] = useKnob('boolean', 'indeterminate', false);
  const [disabled] = useKnob('boolean', 'disabled', false);
  const [value] = useKnob('text', 'value', 'myValue');
  const [label] = useKnob('text', 'label', 'Hello World');

  return (
    <Checkbox
      disabled={disabled}
      checked={checked}
      indeterminate={indeterminate}
      value={value}
      foundationRef={(ref) => console.log(ref)}
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
