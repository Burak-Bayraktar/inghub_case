import { LitElement, html, css } from 'lit';

export class ItemForm extends LitElement {
  static styles = css`
    :host{display:block}
    form{display:grid;gap:12px}
    .actions{display:flex;gap:8px;justify-content:flex-end}
  `;
  static properties = {
    location: { type: Object },
    title: { type: String, state: true },
    note:  { type: String, state: true },
    isEdit:{ type: Boolean, state: true },
  };

  constructor(){
    super();
    this.title = '';
    this.note  = '';
    this.isEdit = false;
  }

  async firstUpdated(){
    const id = this.location?.params?.id;
    if (id){
      this.isEdit = true;
      this.title = `Kayıt #${id}`;
      this.note  = 'Düzenleme modundasın';
    }
  }

  onSubmit(e){
    e.preventDefault();
    location.hash = '/list';
  }

  render(){
    return html`
      <form @submit=${this.onSubmit}>
        <label>
          <span>Başlık</span>
          <input type="text" .value=${this.title} @input=${e=>this.title=e.target.value} required>
        </label>
        <label>
          <span>Not</span>
          <input type="text" .value=${this.note} @input=${e=>this.note=e.target.value}>
        </label>
        <div class="actions">
          <a href="#/list"><button type="button">İptal</button></a>
          <button class="primary" type="submit">${this.isEdit?'Kaydet':'Oluştur'}</button>
        </div>
      </form>
    `;
  }
}
customElements.define('item-form', ItemForm);
