// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as RMWC from '../types';
import React from 'react';
import { useProviderContext } from '../provider';
import { Tag, useClassNames, createComponent } from '../base';

export type TypographyT =
  | 'headline1'
  | 'headline2'
  | 'headline3'
  | 'headline4'
  | 'headline5'
  | 'headline6'
  | 'subtitle1'
  | 'subtitle2'
  | 'body1'
  | 'body2'
  | 'caption'
  | 'button'
  | 'overline';

/** The Typography Component */
export interface TypographyProps {
  /** The typography style.*/
  use: TypographyT;
}

export type TypographyHTMLProps = RMWC.HTMLProps<HTMLElement>;

/** The Typography Component */
export const Typography = createComponent<TypographyProps, TypographyHTMLProps>(
  function Typography(props, ref) {
    const { use, ...rest } = props;

    const providerContext = useProviderContext();

    const typographyOptions = providerContext.typography;

    const tag =
      typographyOptions?.[use] || typographyOptions?.defaultTag || 'span';

    const className = useClassNames(props, [
      {
        [`mdc-typography--${props.use}`]: props.use,
      },
    ]);

    return <Tag tag={tag} {...rest} ref={ref} className={className} />;
  }
);
