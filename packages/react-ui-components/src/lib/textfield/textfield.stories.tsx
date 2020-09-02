import React from 'react';
import { boolean, text, number } from '@storybook/addon-knobs';
import { TextField } from './';

function TextFieldStory() {
  const [value, setValue] = React.useState('');

  return (
    <TextField
      pattern="[A-Za-z]{3}"
      label={text('label', 'Hello world')}
      value={text('value', value)}
      disabled={boolean('disabled', false)}
      required={boolean('required', false)}
      outlined={boolean('outlined', false)}
      invalid={boolean('invalid', false)}
      onChange={(evt) => setValue(evt.currentTarget.value)}
      rows={number('rows', 8)}
      cols={number('cols', 0)}
      icon={text('withLeadingIcon', '')}
      trailingIcon={text('withTrailingIcon', '')}
      textarea={boolean('textarea', false)}
      foundationRef={console.log}
    />
  );
}

class TextFieldUncontrolledStory extends React.Component {
  state = {
    counter: 0,
  };
  render() {
    return (
      <div>
        <TextField label="Hello" />
        <button
          onClick={() => this.setState({ counter: this.state.counter + 1 })}
        >
          Force Re-render {this.state.counter}
        </button>
      </div>
    );
  }
}

export default {
  title: 'TextField',
  component: TextField,
};

export const TextFieldControlled = () => <TextFieldStory />;

export const TextFieldUncontrolled = () => <TextFieldUncontrolledStory />;

export const AutoFocus = () => <TextField label="Hello" autoFocus />;

export const Changing = function () {
  const [value, setValue] = React.useState('');

  React.useEffect(() => {
    setInterval(() => {
      setValue((val) => (val === '' ? 'Hello World' : ''));
    }, 2000);
  }, []);

  return (
    <TextField label="Controlled" value={value} outlined onChange={() => {}} />
  );
};
