import React from 'react';
import { Popover, PopoverProps } from '@material-ui/core';

export const McPopover = (props: PopoverProps) => 
{
    const {children, ...rest} = props;
    return (
        <Popover {...rest}>
            {children}
        </Popover>
    );
}
