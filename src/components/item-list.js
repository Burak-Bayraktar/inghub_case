import { html, css } from 'lit';
import { LocalizedComponent } from './localized-component.js';
import './employee-table.js';

export class ItemList extends LocalizedComponent {
  static styles = css`
    :host { display:block; }
    h3 { margin-bottom: 16px; }
  `;

  render() {
    return html`
      <employee-table
        @edit=${(e) => console.log('Edit:', e.detail)}
        @delete=${(e) => console.log('Delete:', e.detail)}
        @selection-change=${(e) => console.log('Selected:', e.detail.ids)}
      ></employee-table>
    `;
  }
}
customElements.define('item-list', ItemList);
