import { DecoratorFunction, ArgTypes } from '@storybook/addons';

export interface CSFStory<StoryFnReturnType = unknown> {
  story?: {
    name?: string;
    decorators?: DecoratorFunction<StoryFnReturnType>[];
    parameters?: { [name: string]: unknown };
  };
  argTypes?: ArgTypes;
  (): StoryFnReturnType;
}
