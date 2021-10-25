/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/prefer-regexp-exec, @typescript-eslint/no-magic-numbers*/
import React, { useState, useRef, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import getCaretCoordinates from 'textarea-caret';
import getInputSelection, { setCaretPosition } from 'get-input-selection';

import './autocomplete.css';

const KEY_UP = 38;
const KEY_DOWN = 40;
const KEY_RETURN = 13;
const KEY_ENTER = 14;
const KEY_ESCAPE = 27;
const KEY_TAB = 9;

const OPTION_LIST_Y_OFFSET = 10;
const OPTION_LIST_MIN_WIDTH = 100;

export interface IAutocompleteProps {
  Component:  React.ReactElement,
  ComponentProps: Record<string,unknown>,
  defaultValue: string,
  disabled: boolean,
  maxOptions: number,
  onBlur: () => void,
  onChange: (val: string) => void,
  onKeyDown: (evt: any) => void,
  onRequestOptions: (val: string) => void,
  onSelect: (val: string) => void,
  changeOnSelect: (trigger: string, slug: string) => string,
  options: string[],
  regex: string,
  matchAny: boolean,
  minChars: number,
  requestOnlyIfNoOptions: boolean,
  spaceRemovers: string[],
  spacer: string,
  trigger: string | string[],
  value: string | undefined,
  offsetX: number,
  offsetY: number,
  passThroughEnter: boolean,
  mode: 'autocomplete' | 'assist',
  direction: 'ltr' | 'rtl',
}

const Autocomplete: React.FC<IAutocompleteProps> = (props) => {
  const [recentValue, setRecentValue] = useState(props.defaultValue);
  const [enableSpaceRemovers, setEnableSpaceRemovers] = useState(false);
  
  const [state, setState] = useState({
    helperVisible: false,
    left: 0,
    right: 0,
    trigger: '',
    matchLength: 0,
    matchStart: 0,
    options: [],
    selection: 0,
    top: 0,
    value: '',
    caret: 0,
    width: 'unset',
  });
  const refInput = useRef(null);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return (): void => {
      try {
        window.removeEventListener('resize', handleResize);
      } catch (e) {
        console.log('WINDOW "resize" remove listener failed', e);
      }
    };
  }, []);
  
  useEffect(() => {
    const { options } = props;
    const { caret } = state;

    // if (options.length !== prevProps.options.length) {
      updateHelper(recentValue, caret, options);
    // }
  }, [props]);
  
  const getMatch = (str: string, caret: number, providedOptions: string[]): Record<string,unknown> => {
    const { trigger, matchAny, regex } = props;
    const re = new RegExp(regex);

    let triggers = trigger;
    if (!Array.isArray(triggers)) {
      triggers = new Array(trigger) as string[];
    }
    triggers.sort();

    const providedOptionsObject: Record<string,unknown> = {};
    if (Array.isArray(providedOptions)) {
      triggers.forEach((triggerStr) => {
        providedOptionsObject[triggerStr] = providedOptions;
      });
    }

    const triggersMatch = arrayTriggerMatch(triggers, re);
    let slugData: Record<string,unknown> = {};

    for (let triggersIndex = 0; triggersIndex < triggersMatch.length; triggersIndex++) {
      const { triggerStr, triggerMatch, triggerLength } = triggersMatch[triggersIndex];

      for (let i = caret - 1; i >= 0; --i) {
        const substr = str.substring(i, caret);
        const match = substr.match(re);
        let matchStart = -1;

        if (triggerLength > 0) {
          const triggerIdx = triggerMatch ? i : i - triggerLength + 1;

          if (triggerIdx < 0) { // out of input
            break;
          }

          if (isTrigger(triggerStr, str, triggerIdx)) {
            matchStart = triggerIdx + triggerLength;
          }

          if (!match && matchStart < 0) {
            break;
          }
        } else {
          if (match && i > 0) { // find first non-matching character or begin of input
            continue;
          }
          matchStart = i === 0 && match ? 0 : i + 1;

          if (caret - matchStart === 0) { // matched slug is empty
            break;
          }
        }

        if (matchStart >= 0) {
          const triggerOptions = providedOptionsObject[triggerStr] as string[];
          if (!Array.isArray(triggerOptions)) {
            continue;
          }

          const matchedSlug = str.substring(matchStart, caret);

          const options = triggerOptions.filter((slug) => {
            const idx = slug.toLowerCase().indexOf(matchedSlug.toLowerCase());
            return idx !== -1 && (matchAny || idx === 0);
          });

          const currTrigger = triggerStr;
          const matchLength = matchedSlug.length;

          if (slugData === {}) {
            slugData = {
              trigger: currTrigger, matchStart, matchLength, options,
            };
          }
          else {
            slugData = {
              ...slugData, trigger: currTrigger, matchStart, matchLength, options,
            };
          }
        }
      }
    }

    return slugData;
  }

  const arrayTriggerMatch = (triggers: string[], re: RegExp) => {
    const triggersMatch = triggers.map((trigger) => ({
      triggerStr: trigger,
      triggerMatch: trigger.match(re),
      triggerLength: trigger.length,
    }));

    return triggersMatch;
  }

  const isTrigger = (trigger: string, str: string, i: number): boolean => {
    if (!trigger || !trigger.length) {
      return true;
    }

    if (str.substr(i, trigger.length) === trigger) {
      return true;
    }

    return false;
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {
      onChange,
      options,
      spaceRemovers,
      spacer,
      value,
    } = props;

    const old = recentValue;
    const str = e.target.value;
    const caret = (getInputSelection(getInputElement(e.target)) as {start: number, end: number}).end;

    if (!str.length) {
      updateState({
        ...state,
        helperVisible: false 
      });
    }

    setRecentValue(str);

    updateState({
      ...state,
      caret, 
      value: e.target.value 
    });

    if (!str.length || !caret) {
      return onChange(e.target.value);
    }

    // '@wonderjenny ,|' -> '@wonderjenny, |'
    if (enableSpaceRemovers && spaceRemovers.length && str.length > 2 && spacer.length) {
      for (let i = 0; i < Math.max(old.length, str.length); ++i) {
        if (old[i] !== str[i]) {
          if (
            i >= 2
            && str[i - 1] === spacer
            && spaceRemovers.indexOf(str[i - 2]) === -1
            && spaceRemovers.indexOf(str[i]) !== -1
            && getMatch(str.substring(0, i - 2), caret - 3, options) !== {}
          ) {
            const newValue = (`${str.slice(0, i - 1)}${str.slice(i, i + 1)}${str.slice(i - 1, i)}${str.slice(i + 1)}`);

            updateCaretPosition(i + 1);
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if(refInput.current !== null){
              (refInput.current as unknown as Record<string,unknown>).value = newValue;
            }

            if (!value) {
              updateState({
                ...state,
                value: newValue 
              });
            }

            return onChange(newValue);
          }

          break;
        }
      }

      setEnableSpaceRemovers(false);
    }

    updateHelper(str, caret, options);

    // if (!value) {
    //   updateState({
    //     ...state,
    //     value: e.target.value 
    //   });
    // }

    return onChange(e.target.value);
  }

  const getInputElement = (parent: HTMLElement | undefined): HTMLElement | undefined => {
    if(parent !== undefined){
      if(parent.children.length > 0){
        const innerTextAreas = parent.getElementsByTagName('textarea');
        if(innerTextAreas.length>0){
          return innerTextAreas[0];
        }
    
        const innerInputs = parent.getElementsByTagName('input');
        if(innerInputs.length>0){
          return innerInputs[0];
        }
      }
      else {
        return parent;
      }
    }

    return undefined;
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    const { helperVisible, options, selection } = state;
    const { onKeyDown, passThroughEnter } = props;

    if (helperVisible) {
      switch (event.keyCode) {
        case KEY_ESCAPE:
          event.preventDefault();
          resetHelper();
          break;
        case KEY_UP:
          event.preventDefault();
          updateState(
            { 
              ...state,
              selection: ((options.length + selection) - 1) % options.length 
            });
          break;
        case KEY_DOWN:
          event.preventDefault();
          updateState(
            {
              ...state,
              selection: (selection + 1) % options.length 
            });
          break;
        case KEY_ENTER:
        case KEY_RETURN:
          if (!passThroughEnter) { event.preventDefault(); }
          handleSelection(selection);
          break;
        case KEY_TAB:
          handleSelection(selection);
          break;
        default:
          onKeyDown(event);
          break;
      }
    } else {
      onKeyDown(event);
    }
  }

  const handleResize = () => {
    updateState({ 
      ...state,
      helperVisible: false 
    });
  }

  const handleSelection = (idx: number) => {
    const { spacer, onSelect, changeOnSelect } = props;
    const {
      matchStart, matchLength, options, trigger,
    } = state;

    const slug = options[idx];
    const value = recentValue;
    const part1 = value.substring(0, matchStart - trigger.length);
    const part2 = value.substring(matchStart + matchLength);

    const event = { target: refInput.current };
    const changedStr = changeOnSelect(trigger, slug);

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (event.target !== null){
      (event.target as unknown as Record<string,unknown>).value = `${part1}${changedStr}${spacer}${part2}`;
    }
    handleChange(event as any);
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if(event.target !== null){
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      onSelect((event.target as any).value);
    }

    resetHelper();

    updateCaretPosition(part1.length + changedStr.length + 1);

    setEnableSpaceRemovers(true);
  }

  const updateCaretPosition = (caret: number) => {
    updateState(
      { 
        ...state,
        caret 
      }
    );

    // setCaretPosition(refInput.current, caret);
    const input = getInputElement((refInput.current as unknown) as HTMLElement);
    setCaretPosition(input, caret);
  }

  const updateState = (val: any) => {
    setTimeout(()=>{
      setState(
      {
       ...val
      });
    },0);
  };

  const updateHelper = (str: string, caret: number, options: string[]) => {
    /* eslint-disable */ 
    const parent = (refInput.current as unknown) as HTMLElement;
    if(refInput.current === null){
      return;
    }

    const input = getInputElement(parent);
    if (input === undefined){
      return;
    }
    const parentRect = parent.getBoundingClientRect();

    const slug = getMatch(str, caret, options) as any;

    if (Object.keys(slug).length > 0 && input !== null) {
      const caretPos = getCaretCoordinates(input, caret);
      const rect = input.getBoundingClientRect();
      const { minChars, onRequestOptions, requestOnlyIfNoOptions, mode } = props;

      let top, left, right, width='unset';
      if(mode === 'assist'){
        top = (parent === input) ? (caretPos.top + input.offsetTop) : (caretPos.top + parentRect.top);
        left = Math.min(
          caretPos.left + input.offsetLeft - OPTION_LIST_Y_OFFSET,
          input.offsetLeft + rect.width - OPTION_LIST_MIN_WIDTH,
        );
      } else {
        top = parentRect.top + parent.offsetHeight;
        left = parent.offsetLeft;
        right = parent.offsetLeft - parent.offsetWidth;
        width = `${parentRect.width}px`;
      }

      if (
        slug.matchLength >= minChars
        && (
          slug.options.length > 1
          || (
            slug.options.length === 1
            && slug.options[0].length !== slug.matchLength
          )
        )
      ) {
          updateState(
          {
            ...state,
            value: str,
            helperVisible: true,
            top,
            left,
            right,
            width,
            ...slug,
          });
        } else {
          if (!requestOnlyIfNoOptions || !slug.options.length) {
            onRequestOptions(str.substr(slug.matchStart, slug.matchLength));
          }

          resetHelper();
        }
    } else {
      resetHelper();
    }
    /* eslint-enable */
  }

  const resetHelper = () => {
    setTimeout(()=>{
      updateState(
        { 
          ...state,
          helperVisible: false, selection: 0 
        }
      );
    }, 100);
  }

  const renderAutocompleteList = () => {
    const {
      helperVisible,
      left,
      right,
      matchStart,
      matchLength,
      options,
      selection,
      top,
      value,
      width,
    } = state;

    if (!helperVisible) {
      return null;
    }

    const { maxOptions, offsetX, offsetY, direction } = props;

    if (options.length === 0) {
      return null;
    }

    if (selection >= options.length) {
      updateState({
        ...state,
        selection: 0 
      });

      return null;
    }

    const optionNumber = maxOptions === 0 ? options.length : maxOptions;

    const helperOptions = options.slice(0, optionNumber).map((val: string, idx) => {
      const highlightStart = val.toLowerCase().indexOf(value.substr(matchStart, matchLength).toLowerCase());

      return (
        <li
          className={idx === selection ? 'active' : undefined}
          key={val}
          onClick={() => { handleSelection(idx); }}
          onMouseEnter={() => { updateState(
            {
              ...state,
              selection: idx 
            }); }}
        >
          {val.slice(0, highlightStart)}
          <strong>{val.substr(highlightStart, matchLength)}</strong>
          {val.slice(highlightStart + matchLength)}
        </li>
      );
    });

    const horizontalPosition = (direction === 'ltr') ? {left: left + offsetX} : {right: right + offsetX};
    return (
      <ul className="react-autocomplete-input" style={{ ...horizontalPosition, top: top + offsetY, width }}>
        {helperOptions}
      </ul>
    );
  };

  const {
    Component,
    ComponentProps,
    defaultValue,
    disabled,
    onBlur,
    value,
    ...rest
  } = props;

  const stateValue = recentValue;//state.value;
    
  const propagated: any = Object.assign({}, rest);
  Object.keys(props).forEach((k) => { delete (propagated as Record<string,unknown>)[k]; });

  let val = '';

  if (stateValue) {
    val = stateValue;
  } else if (defaultValue) {
    val = defaultValue;
  } else if (value !== undefined) {
    val = value;
  } 


  return (
    <>
    {
      React.cloneElement(Component, {
        disabled: disabled,
        onBlur: onBlur,
        onChange: handleChange,
        onKeyDown: handleKeyDown,
        ref: refInput,
        value: val,
        ...propagated,
        ...ComponentProps,
        })
      }
      {renderAutocompleteList()}
    </>
  );

}

const defaultProps: IAutocompleteProps = {
  Component: <textarea />,
  ComponentProps: {},
  defaultValue: '',
  disabled: false,
  maxOptions: 6,
  onBlur: () => {},
  onChange: (val: string) => {},
  onKeyDown: (evt: any) => {},
  onRequestOptions: (val: string) => {},
  onSelect: (val: string) => {},
  changeOnSelect: (trigger: string, slug: string): string => `${trigger}${slug}`,
  options: [],
  regex: '^[A-Za-z0-9\\-_]+$',
  matchAny: false,
  minChars: 0,
  requestOnlyIfNoOptions: true,
  spaceRemovers: [',', '.', '!', '?'],
  spacer: ' ',
  trigger: '@',
  offsetX: 0,
  offsetY: 0,
  value: undefined,
  passThroughEnter: false,
  mode: 'assist',
  direction: 'ltr',
};

interface IAutocompleteOptionalProps extends Partial<IAutocompleteProps> {};
export const AutocompleteWithDefauls: React.FC<IAutocompleteOptionalProps> = (props) => {
  let compProps = {
    ...defaultProps,
    ...props,
  };
  if(props.mode === 'autocomplete'){
    compProps = {
      ...compProps,
      trigger: '',
      regex: '.',
      spacer: '',
    }
  }
  return (
    <Autocomplete {...compProps}/>
  );
};
export default AutocompleteWithDefauls;
