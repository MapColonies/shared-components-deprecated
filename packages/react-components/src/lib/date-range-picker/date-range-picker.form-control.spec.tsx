import React from 'react';
import { mount } from 'enzyme';
import { KeyboardDateTimePicker } from '@material-ui/pickers';
import { Button } from '@map-colonies/react-core';
import { DateTimeRangePickerFormControl } from './date-range-picker.form-control';

const date = new Date(1990, 1, 1);

it('set the values of to and from to the props of the date pickers when changed', () => {
  const wrapper = mount(
    <DateTimeRangePickerFormControl
      onChange={() => {
        // do nothing for linitng
      }}
    />
  );
  wrapper.setProps({ from: date, to: date });
  // eslint-disable-next-line
  wrapper.find(Button).first().simulate('click', { currentTarget: {} });

  wrapper.update();
  const pickers = wrapper.find(KeyboardDateTimePicker);
  const fromRangePicker = pickers.first();
  const toRangePicker = pickers.at(1);

  expect(fromRangePicker.prop('value')?.valueOf()).toBe(date.getTime());
  expect(toRangePicker.prop('value')?.valueOf()).toBe(date.getTime());
});

it('calls on change with right argumnets when inner set button is clicked', () => {
  const onChangeMock = jest.fn();
  const wrapper = mount(
    <DateTimeRangePickerFormControl
      from={date}
      to={date}
      onChange={onChangeMock}
    />
  );

  // eslint-disable-next-line
  wrapper.find(Button).at(1).props().onClick?.();

  expect(onChangeMock).toHaveBeenCalledWith({ from: date, to: date });

  wrapper.setProps({ to: null });
  wrapper.update();

  // eslint-disable-next-line
  wrapper.find(Button).at(1).props().onClick?.();
  expect(onChangeMock).toHaveBeenCalledWith({ from: date });

  wrapper.setProps({ to: date, from: null });
  wrapper.update();

  // eslint-disable-next-line
  wrapper.find(Button).at(1).props().onClick?.();
  expect(onChangeMock).toHaveBeenCalledWith({ to: date });
});
