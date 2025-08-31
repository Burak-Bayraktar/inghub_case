import {html, css} from 'lit';
import {LocalizedComponent} from './localized-component.js';

export class PageTitle extends LocalizedComponent {
  static styles = css`
    :host {
      display: block;
      background: rgb(248, 249, 250);
    }
    
    :host([inline]) {
      padding: 0;
      margin: 0;
      background: transparent;
    }
    
    :host(:not([inline])) {
      padding: 20px 0;
      margin-bottom: 24px;
    }
    
    .page-title {
      font-size: 18px;
      font-weight: 600;
      color: #ff6200;
      margin: 0;
    }
    
    @media (max-width: 768px) {
      .page-title {
        font-size: 16px;
      }
    }
  `;
  
  static properties = {
    title: {type: String}
  };

  constructor() {
    super();
    this.title = '';
  }

  render() {
    return html`
      <h2 class="page-title">${this.title}</h2>
    `;
  }
}

customElements.define('page-title', PageTitle);
