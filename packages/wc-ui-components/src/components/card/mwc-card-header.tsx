import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'mwc-card-header',
  styleUrl: 'mwc-card-header.scss',
  shadow: false
})
export class MWCCardHeader{

  @Prop() maintitle: string;
  @Prop() subtitle : string;

  renderTitle(){
      if(this.maintitle){
          return(
               <h1 class="mdc-card__title mdc-card__title--large">
               {this.maintitle}
               </h1>
          )
      }
      return null;
  }
  renderSubTitle(){
      if(this.subtitle){
          return(
              <h2 class="mdc-card__subtitle">
              {this.subtitle}
              </h2>
          )
      }
      return null;
  }
  render() {
    return (
        <section class="mdc-card__primary">
        {
            this.renderTitle()
        }
        {
             this.renderSubTitle()
        }
        <slot />
        </section>
    )
  }
}
