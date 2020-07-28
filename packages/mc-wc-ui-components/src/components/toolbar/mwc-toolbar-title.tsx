import { Component, Prop, Element, h} from '@stencil/core';

@Component({
  tag: 'mwc-toolbar-title',
  shadow: false
})
export class MWCToolbarTitle{

  @Element() toolbarTitleEl : HTMLElement;

  componentWillLoad(){
     this.toolbarTitleEl.className = 'mdc-toolbar__title'
  }

  render() {
    return (
         <slot />
    )
  }
}