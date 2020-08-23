// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as RMWC from '../types';
import React from 'react';
import { MDCFormFieldFoundation } from '@material/form-field';
import { Tag, useClassNames, createComponent } from '../base';
import { useFormfieldFoundation } from './foundation';

/** A FormField component. */
export interface FormFieldProps {
  /** Position the input after the label. */
  alignEnd?: boolean;
  /** Advanced: A reference to the MDCFoundation. */
  foundationRef?: React.Ref<MDCFormFieldFoundation>;
}

/** A FormField component. */
export const FormField = createComponent<FormFieldProps>(function FormField(
  props,
  ref
) {
  useFormfieldFoundation(props);

  const { alignEnd, foundationRef, ...rest } = props;
  const className = useClassNames(props, [
    'mdc-form-field',
    {
      'mdc-form-field--align-end': props.alignEnd,
    },
  ]);
  return <Tag {...rest} ref={ref} className={className} />;
});
