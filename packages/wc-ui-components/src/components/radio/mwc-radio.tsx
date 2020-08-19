import { Component, Prop, Element, h } from '@stencil/core';
import { MDCRadio } from '@material/radio';
import createTheme from '../styles/create-theme';
import { getTheme } from '../util/mwc-util';

@Component({
  tag: 'mwc-radio',
  styleUrl: 'mwc-radio.scss',
  shadow: false,
})
export class MWCRadio {
  @Element() radioEl: HTMLElement;
  @Prop() borderlist: boolean = true;
  @Prop() checked: boolean = false;
  @Prop() dense: boolean = false;
  @Prop() ripple: boolean = true;
  @Prop() name: string;
  @Prop() color: 'default' | 'primary' | 'secondary'; //Alex

  radioRipple: any;
  mdcRadio: any;
  elStyleNode: any;

  private theme = createTheme(getTheme());

  componentWillLoad() {
    if (this.color) {
      //Alex
      this.radioEl.style.setProperty(
        '--mdc-theme-secondary',
        this.theme.palette[this.color][500]
      );
      // this.radioEl.style.setProperty('color',this.theme.palette[this.color][500]);
    }
  }

  componentDidLoad() {
    if (this.ripple) {
      this.radioRipple = MDCRadio.attachTo(this.mdcRadio);
      //  this.radioRipple.unbounded = true
    }
  }
  componentDidUnload() {
    if (this.ripple) {
      this.radioRipple.destroy();
    }
  }

  getListClassName() {
    let className: string = 'mdc-list';
    if (this.borderlist) {
      className = ` ${className} webmd-bordered-list`;
    }
    if (this.dense) {
      className = ` ${className} mdc-list--dense`;
    }
    return className;
  }

  getStyleNode() {
    var styleNode = document.createElement('style');
    styleNode.type = 'text/css';
    var styleText = document.createTextNode(`.mdc-radio::before, .mdc-radio::after{
                    background-color: ${this.color}20 !important;
                }`);
    styleNode.appendChild(styleText);
    this.elStyleNode = styleNode;
    this.radioEl.appendChild(this.elStyleNode);
  }
  onFocus() {
    if (this.color) {
      this.getStyleNode();
    }
  }
  onBlur() {
    if (this.color) {
      this.radioEl.removeChild(this.elStyleNode);
    }
  }

  render() {
    return (
      <div
        class="mdc-radio"
        ref={(mdcRadio) => {
          this.mdcRadio = mdcRadio;
        }}
      >
        <input
          class="mdc-radio__native-control"
          type="radio"
          checked={this.checked}
          name={this.name}
          onFocus={(evt) => this.onFocus()}
          onBlur={(evt) => this.onBlur()}
        />
        <div class="mdc-radio__background">
          <div class="mdc-radio__outer-circle"></div>
          <div class="mdc-radio__inner-circle"></div>
        </div>
      </div>
    );
  }
}
