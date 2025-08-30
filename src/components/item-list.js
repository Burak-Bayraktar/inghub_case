import { LitElement, html, css } from 'lit';
import './employee-table.js';

export class ItemList extends LitElement {
  static styles = css`
    :host { display:block; }
    h3 { margin-bottom: 16px; }
  `;

  constructor() {
    super();
    this.rows = [
      { id:'1', firstName:'Ahmet', lastName:'Sourtimes', doe:'23/09/2022', dob:'23/09/2022',
        phone:'+(90) 532 123 45 67', email:'ahmet@sourtimes.org', dept:'Analytics', position:'Junior' },
      { id:'2', firstName:'Mehmet', lastName:'Test', doe:'01/01/2023', dob:'02/02/1990',
        phone:'+(90) 555 123 45 67', email:'mehmet@test.org', dept:'Engineering', position:'Senior' }
    ];
  }

  render() {
    return html`
      <h3>Çalışanlar</h3>
      <employee-table
        .rows=${this.rows}
        @edit=${(e) => console.log('Edit:', e.detail)}
        @delete=${(e) => console.log('Delete:', e.detail)}
        @selection-change=${(e) => console.log('Selected:', e.detail.ids)}
      ></employee-table>
    `;
  }
}
customElements.define('item-list', ItemList);
