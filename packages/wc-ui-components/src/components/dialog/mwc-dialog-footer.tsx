import { Component, Element, h } from '@stencil/core';

@Component({
  tag: 'mwc-dialog-footer',
  styleUrl: 'mwc-dialog-footer.scss',
  shadow: false
})

export class MWCDialogFooter{

  @Element() dialogFooterEl: HTMLElement;

  componentDidLoad(){
    Array.from(this.dialogFooterEl.children[0].children).forEach((item,index)=>{
        item.classList.add('mdc-dialog__footer__button')
        if(item.getAttribute('type') == "accept"){
            item.classList.add('mdc-dialog__footer__button--accept')
        }
        if(item.getAttribute('type') == "cancel"){
            item.classList.add('mdc-dialog__footer__button--cancel')
        }
    })
  }
  render() {
    return (
         <footer class="mdc-dialog__footer" >
            <slot />
        </footer>
    )
  }
}
