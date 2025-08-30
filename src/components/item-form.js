import {html, css} from 'lit';
import {msg} from '@lit/localize';
import {LocalizedComponent} from './localized-component.js';

export class ItemForm extends LocalizedComponent {
  static styles = css`
    :host {
      display: block;
    }
    form {
      display: grid;
      gap: 12px;
    }
    .actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    }
  `;
  static properties = {
    location: {type: Object},
    title: {type: String, state: true},
    note: {type: String, state: true},
    isEdit: {type: Boolean, state: true},
  };

  constructor() {
    super();
    this.title = '';
    this.note = '';
    this.isEdit = false;
  }

  async firstUpdated() {
    const id = this.location?.params?.id;
    if (id) {
      this.isEdit = true;
      this.title = `${msg('Record')} #${id}`;
      this.note = msg('You are in edit mode');
    }
  }

  onSubmit(e) {
    e.preventDefault();
    location.hash = '/';
  }

  render() {
    return html`
      <form @submit=${this.onSubmit}>
        <label>
          <span>${msg('Title')}</span>
          <input
            type="text"
            .value=${this.title}
            @input=${(e) => (this.title = e.target.value)}
            required
          />
        </label>
        <label>
          <span>${msg('Note')}</span>
          <input
            type="text"
            .value=${this.note}
            @input=${(e) => (this.note = e.target.value)}
          />
        </label>
        <div class="actions">
          <a href="#/"><button type="button">${msg('Cancel')}</button></a>
          <button class="primary" type="submit">
            ${this.isEdit ? msg('Save') : msg('Create')}
          </button>
        </div>
      </form>
    `;
  }
}

customElements.define('item-form', ItemForm);
